"""Admin configuration for the attendance app.

This module wires up Django's admin interface for the attendance related
models. Thumbnails are rendered for check-in/out photos and quick decision
buttons are provided to speed up approval workflows.

Image thumbnails rely on ``MEDIA_URL``/``MEDIA_ROOT`` being configured in the
project settings so that uploaded files can be served during development and
in production.
"""

from django.contrib import admin, messages
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.html import format_html

from .models import (
    AdvisorPayrollProfile,
    AdvisorSchedule,
    Attendance,
    AttendanceRequest,
    ScheduleException,
    Shift,
    WeekOff,
)
from store.models import StoreGeofence


# ---------------------------------------------------------------------------
# Shift
# ---------------------------------------------------------------------------
@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    """Admin interface for the :class:`Shift` model."""

    list_display = ("name", "start_time", "end_time", "is_overnight", "is_active")
    list_filter = ("is_active", "is_overnight")
    search_fields = ("name",)

    @admin.action(description="Mark selected shifts active")
    def mark_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} shifts marked active", messages.INFO)

    @admin.action(description="Mark selected shifts inactive")
    def mark_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} shifts marked inactive", messages.INFO)

    actions = ["mark_active", "mark_inactive"]


# ---------------------------------------------------------------------------
# Advisor payroll profile
# ---------------------------------------------------------------------------
@admin.register(AdvisorPayrollProfile)
class AdvisorPayrollProfileAdmin(admin.ModelAdmin):
    """Admin interface for the :class:`AdvisorPayrollProfile` model."""

    list_display = ("user", "hourly_rate", "effective_from", "is_active")
    list_filter = ("is_active",)
    search_fields = ("user__username", "user__first_name", "user__last_name")
    list_editable = ("hourly_rate", "is_active")
    ordering = ("user__username",)


# ---------------------------------------------------------------------------
# Advisor schedule
# ---------------------------------------------------------------------------
@admin.register(AdvisorSchedule)
class AdvisorScheduleAdmin(admin.ModelAdmin):
    """Admin interface for :class:`AdvisorSchedule`."""

    list_display = (
        "user",
        "rule_type",
        "anchor_monday",
        "parity_offset",
        "default_shift",
        "week_even_shift",
        "week_odd_shift",
        "is_active",
        "updated_at",
    )
    list_filter = ("rule_type", "is_active")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
    )
    date_hierarchy = "anchor_monday"


# ---------------------------------------------------------------------------
# Week off
# ---------------------------------------------------------------------------
@admin.register(WeekOff)
class WeekOffAdmin(admin.ModelAdmin):
    """Admin interface for :class:`WeekOff`."""

    list_display = ("user", "weekday", "is_active", "updated_at")
    list_filter = ("weekday", "is_active")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
    )


# ---------------------------------------------------------------------------
# Schedule exception
# ---------------------------------------------------------------------------
@admin.register(ScheduleException)
class ScheduleExceptionAdmin(admin.ModelAdmin):
    """Admin interface for :class:`ScheduleException`."""

    list_display = (
        "user",
        "date",
        "override_shift",
        "mark_off",
        "created_by",
        "created_at",
    )
    list_filter = ("mark_off", "override_shift")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "reason",
    )
    date_hierarchy = "date"


# ---------------------------------------------------------------------------
# Store geofence
# ---------------------------------------------------------------------------
@admin.register(StoreGeofence)
class StoreGeofenceAdmin(admin.ModelAdmin):
    """Admin interface for :class:`StoreGeofence`."""

    list_display = (
        "store",
        "latitude",
        "longitude",
        "radius_m",
        "is_active",
        "updated_at",
        "map_link",
    )
    list_filter = ("is_active",)
    search_fields = ("store__store_name",)

    def map_link(self, obj):  # pragma: no cover - simple HTML helper
        url = f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"
        return format_html('<a href="{}" target="_blank">Map</a>', url)

    map_link.short_description = "Map"
    map_link.allow_tags = True


# ---------------------------------------------------------------------------
# Attendance request inline
# ---------------------------------------------------------------------------
class AttendanceRequestInline(admin.TabularInline):
    """Read-only inline for related :class:`AttendanceRequest`."""

    model = AttendanceRequest
    fields = ("type", "status", "created_at")
    readonly_fields = fields
    extra = 0
    can_delete = False
    show_change_link = True


# ---------------------------------------------------------------------------
# Attendance
# ---------------------------------------------------------------------------
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """Admin interface for :class:`Attendance` records."""

    readonly_fields = (
        "worked_minutes",
        "late_minutes",
        "early_out_minutes",
        "ot_minutes",
        "created_at",
        "updated_at",
        "checkin_thumb",
        "checkout_thumb",
    )

    list_display = (
        "date",
        "user",
        "store",
        "shift",
        "status",
        "worked_minutes",
        "late_minutes",
        "early_out_minutes",
        "ot_minutes",
        "check_in",
        "check_out",
        "has_pending_requests",
    )
    list_filter = ("status", "store", "shift", "date")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "notes",
    )
    date_hierarchy = "date"
    inlines = [AttendanceRequestInline]

    # ---- thumbnail helpers -------------------------------------------------
    def checkin_thumb(self, obj):  # pragma: no cover - HTML rendering
        """Return a thumbnail for the check-in photo."""
        return admin_image_thumb(obj.check_in_photo)

    checkin_thumb.short_description = "Check-in"

    def checkout_thumb(self, obj):  # pragma: no cover - HTML rendering
        """Return a thumbnail for the check-out photo."""
        return admin_image_thumb(obj.check_out_photo)

    checkout_thumb.short_description = "Check-out"

    @admin.display(boolean=True)
    def has_pending_requests(self, obj):
        """Return ``True`` if any pending requests exist for the attendance."""
        return obj.requests.filter(status="PENDING").exists()

    # ---- permission helper -------------------------------------------------
    def _can_decide(self, request, attendance) -> bool:
        user = request.user
        if user.is_superuser or getattr(user, "role", None) == "system_admin":
            return True
        if getattr(user, "role", None) == "branch_head":
            return attendance.user.store_id == getattr(user, "store_id", None)
        return False

    # ---- admin actions -----------------------------------------------------
    @admin.action(description="Approve latest pending request")
    def approve_latest(self, request, queryset):
        if not (request.user.is_superuser or getattr(request.user, "role", "") in {"system_admin", "branch_head"}):
            self.message_user(request, "Not allowed", level=messages.ERROR)
            return
        for att in queryset:
            if not self._can_decide(request, att):
                self.message_user(
                    request,
                    f"Permission denied for {att}",
                    level=messages.WARNING,
                )
                continue
            req = att.requests.filter(status="PENDING").order_by("-created_at").first()
            if not req:
                self.message_user(
                    request,
                    f"No pending request for {att}",
                    level=messages.WARNING,
                )
                continue
            req.approve(request.user)
        self.message_user(request, "Approval action completed", messages.INFO)

    @admin.action(description="Reject latest pending request")
    def reject_latest(self, request, queryset):
        if not (request.user.is_superuser or getattr(request.user, "role", "") in {"system_admin", "branch_head"}):
            self.message_user(request, "Not allowed", level=messages.ERROR)
            return
        for att in queryset:
            if not self._can_decide(request, att):
                self.message_user(
                    request,
                    f"Permission denied for {att}",
                    level=messages.WARNING,
                )
                continue
            req = att.requests.filter(status="PENDING").order_by("-created_at").first()
            if not req:
                self.message_user(
                    request,
                    f"No pending request for {att}",
                    level=messages.WARNING,
                )
                continue
            req.reject(request.user)
        self.message_user(request, "Rejection action completed", messages.INFO)

    actions = ["approve_latest", "reject_latest"]


# ---------------------------------------------------------------------------
# Attendance requests
# ---------------------------------------------------------------------------
@admin.register(AttendanceRequest)
class AttendanceRequestAdmin(admin.ModelAdmin):
    """Admin interface for :class:`AttendanceRequest` with quick actions."""

    change_form_template = "admin/attendance/attendancerequest/change_form.html"

    list_display = (
        "id",
        "attendance",
        "type",
        "status",
        "requested_by",
        "decided_by",
        "decided_at",
        "created_at",
    )
    list_filter = (
        "type",
        "status",
        "attendance__store",
        "attendance__shift",
        "attendance__date",
    )
    search_fields = (
        "attendance__user__username",
        "attendance__user__first_name",
        "attendance__user__last_name",
        "reason",
    )

    def _can_decide(self, request, attendance) -> bool:
        user = request.user
        if user.is_superuser or getattr(user, "role", None) == "system_admin":
            return True
        if getattr(user, "role", None) == "branch_head":
            return attendance.user.store_id == getattr(user, "store_id", None)
        return False

    # ---- bulk actions ------------------------------------------------------
    @admin.action(description="Approve selected")
    def approve_selected(self, request, queryset):
        if not (request.user.is_superuser or getattr(request.user, "role", "") in {"system_admin", "branch_head"}):
            self.message_user(request, "Not allowed", level=messages.ERROR)
            return
        for req in queryset:
            if req.status != "PENDING":
                continue
            if not self._can_decide(request, req.attendance):
                self.message_user(
                    request,
                    f"Permission denied for request {req.pk}",
                    level=messages.WARNING,
                )
                continue
            req.approve(request.user)
        self.message_user(request, "Selected requests approved", messages.INFO)

    @admin.action(description="Reject selected")
    def reject_selected(self, request, queryset):
        if not (request.user.is_superuser or getattr(request.user, "role", "") in {"system_admin", "branch_head"}):
            self.message_user(request, "Not allowed", level=messages.ERROR)
            return
        for req in queryset:
            if req.status != "PENDING":
                continue
            if not self._can_decide(request, req.attendance):
                self.message_user(
                    request,
                    f"Permission denied for request {req.pk}",
                    level=messages.WARNING,
                )
                continue
            req.reject(request.user)
        self.message_user(request, "Selected requests rejected", messages.INFO)

    actions = ["approve_selected", "reject_selected"]

    # ---- change view with quick decision buttons --------------------------
    def change_view(self, request, object_id, form_url="", extra_context=None):
        obj = self.get_object(request, object_id)
        if request.method == "POST" and obj:
            if "_approve" in request.POST:
                if self._can_decide(request, obj.attendance):
                    obj.approve(request.user)
                    self.message_user(request, "Request approved", messages.INFO)
                else:
                    self.message_user(request, "Permission denied", messages.ERROR)
                return HttpResponseRedirect(
                    reverse("admin:attendance_attendancerequest_change", args=[obj.pk])
                )
            if "_reject" in request.POST:
                if self._can_decide(request, obj.attendance):
                    obj.reject(request.user)
                    self.message_user(request, "Request rejected", messages.INFO)
                else:
                    self.message_user(request, "Permission denied", messages.ERROR)
                return HttpResponseRedirect(
                    reverse("admin:attendance_attendancerequest_change", args=[obj.pk])
                )
        extra_context = extra_context or {}
        extra_context["show_approve_reject"] = True
        return super().change_view(request, object_id, form_url, extra_context)


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def admin_image_thumb(filefield, width=80):
    """Render a small image preview for admin list/detail pages."""

    if not filefield:
        return "-"
    url = getattr(filefield, "url", None)
    return (
        format_html(
            '<img src="{}" width="{}" style="border-radius:8px;object-fit:cover" />',
            url,
            width,
        )
        if url
        else "-"
    )

