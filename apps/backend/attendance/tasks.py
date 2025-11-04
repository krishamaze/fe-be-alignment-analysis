"""Utility functions for end-of-day attendance processing.

This module implements helpers used by the management command introduced in
this phase.  The functions are written so they can also be triggered from a
Celery beat task in production but are synchronous and side-effect free enough
to be called directly from tests or other code.
"""

from __future__ import annotations

from datetime import date, datetime, time
from typing import Dict, Tuple

from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Attendance, resolve_planned_shift


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _local_tz():
    """Return the project's configured local timezone."""

    return timezone.get_current_timezone()


def _shift_bounds(att: Attendance) -> Tuple[datetime, datetime]:
    """Return the shift start and end datetimes for ``att``.

    The underlying :meth:`Attendance._shift_bounds_for_date` already accounts
    for overnight shifts by returning an end datetime on the following day when
    appropriate.
    """

    return att._shift_bounds_for_date()


# ---------------------------------------------------------------------------
# Core functions
# ---------------------------------------------------------------------------


def mark_absent_for_date(target_date: date) -> int:
    """Create :class:`Attendance` rows marked ABSENT for a given day.

    For each advisor who has a planned shift on ``target_date`` (as determined
    by :func:`resolve_planned_shift`) and **no** existing attendance record for
    that ``(user, date, shift)`` combination, create a new record with
    ``status='ABSENT'``.  Advisors without an assigned store are skipped as the
    :class:`Attendance` model requires ``store``.

    The function is idempotent: running it multiple times for the same date will
    not create duplicate rows thanks to the model's unique constraint.

    Parameters
    ----------
    target_date:
        The calendar day for which absences should be created.

    Returns
    -------
    int
        Number of ``Attendance`` rows created.
    """

    User = get_user_model()
    created = 0
    advisors = User.objects.filter(role="advisor", is_active=True, deleted=False)

    for user in advisors.iterator():
        shift = resolve_planned_shift(user, target_date)
        if not shift:
            # Off-day – nothing to create
            continue

        if not user.store:
            # Attendance requires a store; policy is to skip such users
            # (could log here if logging is configured).
            continue

        _, was_created = Attendance.objects.get_or_create(
            user=user,
            date=target_date,
            shift=shift,
            defaults={"store": user.store, "status": "ABSENT"},
        )
        if was_created:
            created += 1

    return created


def finalize_open_for_date(target_date: date) -> int:
    """Finalize all open attendances for ``target_date``.

    Any ``Attendance`` rows with ``status`` of ``OPEN`` or ``PENDING_APPROVAL``
    that have a ``check_in`` but missing ``check_out`` will be closed.  The
    synthetic ``check_out`` is set to the earlier of the shift's scheduled end
    or ``23:59:59`` local time on ``target_date``.  Derived minutes and
    ``status`` are recomputed using :meth:`Attendance.apply_grace_and_status`
    with the default rules (15 minute grace, 6 hour half-day threshold and
    5‑minute rounding).

    Records that started with ``PENDING_APPROVAL`` status retain that status
    after computation; approvals are handled manually in a later phase.

    Parameters
    ----------
    target_date:
        The calendar day whose open attendances should be finalized.

    Returns
    -------
    int
        Number of records updated.
    """

    tz = _local_tz()
    end_of_day = timezone.make_aware(
        datetime.combine(target_date, time(23, 59, 59)), tz
    )

    qs = Attendance.objects.select_related("shift").filter(
        date=target_date,
        status__in={"OPEN", "PENDING_APPROVAL"},
        check_out__isnull=True,
    )

    updated = 0
    for att in qs.iterator():
        if not att.check_in:
            # No punches at all – leave for mark_absent_for_date()
            continue

        _, shift_end = _shift_bounds(att)
        synthetic_out = min(shift_end, end_of_day)

        original_status = att.status
        att.check_out = synthetic_out
        att.apply_grace_and_status(grace_minutes=15, halfday_threshold=360)
        if original_status == "PENDING_APPROVAL":
            att.status = "PENDING_APPROVAL"

        Attendance.objects.filter(pk=att.pk).update(
            check_out=att.check_out,
            worked_minutes=att.worked_minutes,
            late_minutes=att.late_minutes,
            early_out_minutes=att.early_out_minutes,
            status=att.status,
        )
        updated += 1

    return updated


def autoclose_for_date(target_date: date) -> Dict[str, int]:
    """Finalize open attendances and mark absences for ``target_date``.

    The functions are executed in a safe order – first finalizing existing open
    records and then creating explicit ``ABSENT`` records for advisors who had a
    planned shift but never checked in.

    Parameters
    ----------
    target_date:
        Day to process.

    Returns
    -------
    dict
        ``{"finalized": X, "absents_created": Y}``
    """

    finalized = finalize_open_for_date(target_date)
    absents = mark_absent_for_date(target_date)
    return {"finalized": finalized, "absents_created": absents}
