# Attendance Fixtures & Seeds

## Loading core shifts
```bash
python manage.py loaddata attendance/fixtures/shifts.json
```

## Seeding basics
```bash
python manage.py seed_attendance_basics
```

The seed command:
- ensures the three core shifts (Shift A, Shift B, Backup) exist
- creates an `AdvisorPayrollProfile` for each advisor missing one with an hourly rate of 120.00
- creates inactive `StoreGeofence` placeholders for stores without one (latitude/longitude 0.0, radius 200m)
- warns if any advisor lacks a store assignment

Times are interpreted in the `Asia/Kolkata` timezone. Geofence placeholders are created inactive and should be updated per store.

For automatic attendance closing (Phase 11), run:
```bash
python manage.py attendance_autoclose
```


## Admin API

All configuration endpoints live under `/api/attendance/admin`, require the
`system_admin` role and **do not** use trailing slashes. Requests must use
`multipart/form-data` and may include an `Idempotency-Key` header on
POST/PUT/PATCH to safely retry writes. Example endpoints:

```
POST   /api/attendance/admin/shifts
GET    /api/attendance/admin/shifts/<id>
PATCH  /api/attendance/admin/geofences/<id>
GET    /api/attendance/admin/schedules/<id>/preview?start=2024-01-01&end=2024-01-07
```

Example cURL (create shift):

```
curl -X POST -H "Authorization: Bearer <token>" \
     -H "Idempotency-Key: 123" \
     -F "name=Shift X" -F "start_time=09:00" -F "end_time=17:00" \
     https://example.com/api/attendance/admin/shifts
```
