"""Filter helpers for the attendance app."""

from django.db.models import QuerySet


def filter_approval_qs(request, qs: QuerySet) -> QuerySet:
    """Filter an approvals queryset based on query parameters.

    Supported query params: ``type``, ``status``, ``store``, ``user``,
    ``date_from`` and ``date_to`` (ISO YYYY-MM-DD).

    * ``type``/``status`` perform exact matching against the available choices.
    * ``store`` filters by ``attendance__store_id``.
    * ``user`` filters by ``attendance__user_id``.
    * ``date_from``/``date_to`` apply inclusive bounds on ``attendance__date``.
    """

    params = request.query_params
    t = params.get("type")
    s = params.get("status")
    store = params.get("store")
    user = params.get("user")
    df = params.get("date_from")
    dt = params.get("date_to")

    if t:
        qs = qs.filter(type=t)
    if s:
        qs = qs.filter(status=s)
    if store:
        qs = qs.filter(attendance__store_id=store)
    if user:
        qs = qs.filter(attendance__user_id=user)
    if df:
        qs = qs.filter(attendance__date__gte=df)
    if dt:
        qs = qs.filter(attendance__date__lte=dt)
    return qs
