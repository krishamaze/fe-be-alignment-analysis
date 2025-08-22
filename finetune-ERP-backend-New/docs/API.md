# API

All paths are relative to `/api/` unless noted.

| Method | Path | View | Auth | Permission | Rate limit |
|---|---|---|---|---|---|
| POST | auth/login | MyTokenObtainPairView | None | AllowAny | — |
| POST | auth/register | RegisterUserView | JWT | SystemAdmin | — |
| POST | auth/logout | LogoutView | JWT | IsAuthenticated | — |
| GET/PATCH/DELETE | auth/me | MeAPIView | JWT | IsAuthenticated | — |
| GET | users | AdminUserViewSet.list | JWT | SystemAdmin | — |
| POST | users | AdminUserViewSet.create | JWT | SystemAdmin | — |
| GET | users/{id} | AdminUserViewSet.retrieve | JWT | SystemAdmin | — |
| PUT/PATCH | users/{id} | AdminUserViewSet.update | JWT | SystemAdmin | — |
| DELETE | users/{id} | AdminUserViewSet.destroy | JWT | SystemAdmin | — |
| GET | stores | StoreViewSet.list | optional | Read only | — |
| POST | stores | StoreViewSet.create | JWT | SystemAdmin | — |
| GET | stores/{id} | StoreViewSet.retrieve | optional | Read only | — |
| PUT/PATCH | stores/{id} | StoreViewSet.update | JWT | SystemAdmin | — |
| DELETE | stores/{id} | StoreViewSet.destroy | JWT | SystemAdmin | — |
| POST | stores/{id}/assign-branch-head | StoreViewSet.assign_branch_head | JWT | SystemAdmin | — |
| POST | stores/{id}/unassign-branch-head | StoreViewSet.unassign_branch_head | JWT | SystemAdmin | — |
| POST | attendance/check-in | CheckInView | JWT | Advisor | — |
| POST | attendance/check-out | CheckOutView | JWT | Advisor | — |
| GET | attendance/me/today | MeTodayView | JWT | Advisor | — |
| GET | attendance/approvals | ApprovalsListView | JWT | SystemAdmin or BranchHead | — |
| POST | attendance/approvals/{id}/approve | ApprovalsApproveView | JWT | SystemAdmin or BranchHead | — |
| POST | attendance/approvals/{id}/reject | ApprovalsRejectView | JWT | SystemAdmin or BranchHead | — |
| GET | attendance/reports/store/{store_id} | StoreMonthlyReportView | JWT | SystemAdmin/BranchHead | — |
| GET | attendance/reports/me | MeMonthlyReportView | JWT | Advisor | — |
| GET/POST | attendance/admin/shifts | ShiftListCreateView | JWT | SystemAdmin | — |
| GET/PUT/PATCH/DELETE | attendance/admin/shifts/{id} | ShiftDetailView | JWT | SystemAdmin | — |
| GET/POST | attendance/admin/schedules | AdvisorScheduleListCreateView | JWT | SystemAdmin | — |
| GET/PUT/PATCH/DELETE | attendance/admin/schedules/{id} | AdvisorScheduleDetailView | JWT | SystemAdmin | — |
| GET | attendance/admin/schedules/{id}/preview | AdvisorSchedulePreviewView | JWT | SystemAdmin | — |
| GET/POST | attendance/admin/weekoffs | WeekOffListCreateView | JWT | SystemAdmin | — |
| GET/PUT/PATCH/DELETE | attendance/admin/weekoffs/{id} | WeekOffDetailView | JWT | SystemAdmin | — |
| GET/POST | attendance/admin/exceptions | ScheduleExceptionListCreateView | JWT | SystemAdmin | — |
| GET/PUT/PATCH/DELETE | attendance/admin/exceptions/{id} | ScheduleExceptionDetailView | JWT | SystemAdmin | — |
| GET/POST | attendance/admin/geofences | GeofenceListCreateView | JWT | SystemAdmin | — |
| GET/PUT/PATCH/DELETE | attendance/admin/geofences/{id} | GeofenceDetailView | JWT | SystemAdmin | — |
| GET | attendance/admin/payroll | PayrollListView | JWT | SystemAdmin | — |
| GET/PUT/PATCH | attendance/admin/payroll/{user_id} | PayrollUpsertView | JWT | SystemAdmin | — |
| POST | token/refresh | TokenRefreshView | refresh | AllowAny | — |
| POST | token/verify | TokenVerifyView | optional | AllowAny | — |

Branch heads are created without a `store` and assigned later via `/stores/{id}/assign-branch-head`.

### auth/me
Returns the authenticated user's profile and mapped store geofences.

```json
{
  "id": 1,
  "name": "Advisor",
  "role": "advisor",
  "store_ids": [1],
  "workledger_enabled": true,
  "store_geofences": [
    {"store_id": 1, "lat": 12.34, "lon": 56.78, "radius_m": 100, "is_active": true}
  ]
}
```

### attendance/me/today
Provides today's shift window and attendance state for advisors.

```json
{
  "cta_state": "start",
  "attendance_id": null,
  "shift_window": {"start": "2025-01-01T09:00:00+05:30", "end": "2025-01-01T17:00:00+05:30"},
  "can_check_in_from": "2025-01-01T08:45:00+05:30",
  "banner": null,
  "early_checkin_window_min": 15,
  "server_time": "2025-01-01T08:40:00+05:30"
}
```

### Errors
Errors follow the default DRF format:

```json
{"detail": "error message"}
```

Validation errors return field-level messages. All list endpoints paginate using the Spring style object with `content`, `pageable.pageNumber` and `pageable.pageSize`.

### Idempotency
Write endpoints under `attendance/admin/*` accept an `Idempotency-Key` header. Subsequent requests with the same key return the first response.
