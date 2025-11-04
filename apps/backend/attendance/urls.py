"""URL routing for the attendance app."""

from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import (
    CheckInView,
    CheckOutView,
    MeTodayView,
    AttendanceDetailView,
    ApprovalsListView,
    ApprovalsApproveView,
    ApprovalsRejectView,
    StoreMonthlyReportView,
    MeMonthlyReportView,
)
from .views_admin import (
    ShiftListCreateView,
    ShiftDetailView,
    AdvisorScheduleListCreateView,
    AdvisorScheduleDetailView,
    AdvisorSchedulePreviewView,
    WeekOffListCreateView,
    WeekOffDetailView,
    ScheduleExceptionListCreateView,
    ScheduleExceptionDetailView,
    GeofenceListCreateView,
    GeofenceDetailView,
    PayrollListView,
    PayrollUpsertView,
)


router = SimpleRouter(trailing_slash=False)

urlpatterns = router.urls

# Explicit non-viewset endpoints (no trailing slashes)
urlpatterns += [
    path("check-in", CheckInView.as_view(), name="attendance-check-in"),
    path("check-out", CheckOutView.as_view(), name="attendance-check-out"),
    path("me/today", MeTodayView.as_view(), name="attendance-me-today"),
    path(
        "attendance/<int:pk>",
        AttendanceDetailView.as_view(),
        name="attendance-detail",
    ),
    path("approvals", ApprovalsListView.as_view(), name="attendance-approvals-list"),
    path(
        "approvals/<int:pk>/approve",
        ApprovalsApproveView.as_view(),
        name="attendance-approvals-approve",
    ),
    path(
        "approvals/<int:pk>/reject",
        ApprovalsRejectView.as_view(),
        name="attendance-approvals-reject",
    ),
    path(
        "reports/store/<int:store_id>",
        StoreMonthlyReportView.as_view(),
        name="attendance-report-store",
    ),
    path(
        "reports/me",
        MeMonthlyReportView.as_view(),
        name="attendance-report-me",
    ),
]

# Admin config endpoints (no trailing slashes)
urlpatterns += [
    path("admin/shifts", ShiftListCreateView.as_view(), name="att-admin-shifts"),
    path(
        "admin/shifts/<int:pk>",
        ShiftDetailView.as_view(),
        name="att-admin-shifts-detail",
    ),
    path(
        "admin/schedules",
        AdvisorScheduleListCreateView.as_view(),
        name="att-admin-schedules",
    ),
    path(
        "admin/schedules/<int:pk>",
        AdvisorScheduleDetailView.as_view(),
        name="att-admin-schedules-detail",
    ),
    path(
        "admin/schedules/<int:pk>/preview",
        AdvisorSchedulePreviewView.as_view(),
        name="att-admin-schedules-preview",
    ),
    path("admin/weekoffs", WeekOffListCreateView.as_view(), name="att-admin-weekoffs"),
    path(
        "admin/weekoffs/<int:pk>",
        WeekOffDetailView.as_view(),
        name="att-admin-weekoffs-detail",
    ),
    path(
        "admin/exceptions",
        ScheduleExceptionListCreateView.as_view(),
        name="att-admin-exceptions",
    ),
    path(
        "admin/exceptions/<int:pk>",
        ScheduleExceptionDetailView.as_view(),
        name="att-admin-exceptions-detail",
    ),
    path(
        "admin/geofences",
        GeofenceListCreateView.as_view(),
        name="att-admin-geofences",
    ),
    path(
        "admin/geofences/<int:pk>",
        GeofenceDetailView.as_view(),
        name="att-admin-geofences-detail",
    ),
    path("admin/payroll", PayrollListView.as_view(), name="att-admin-payroll-list"),
    path(
        "admin/payroll/<int:user_id>",
        PayrollUpsertView.as_view(),
        name="att-admin-payroll-upsert",
    ),
]
