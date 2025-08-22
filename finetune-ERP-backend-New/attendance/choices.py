"""Choice constants for the attendance app."""

# ---------------------------------------------------------------------------
# Scheduling
# ---------------------------------------------------------------------------

#: Rules available for determining the default weekly schedule for an
#: advisor. ``fixed`` means the same shift every week while
#: ``alternate_weekly`` toggles between two shifts on alternate weeks.
ScheduleRuleType = (
    ("fixed", "Fixed"),
    ("alternate_weekly", "Alternate Weekly"),
)

# ---------------------------------------------------------------------------
# Attendance
# ---------------------------------------------------------------------------

#: Workflow statuses for an attendance record.
AttendanceStatus = (
    ("OPEN", "Open"),
    ("PRESENT", "Present"),
    ("HALF_DAY", "Half Day"),
    ("ABSENT", "Absent"),
    ("PENDING_APPROVAL", "Pending Approval"),
)

# ---------------------------------------------------------------------------
# Attendance Requests
# ---------------------------------------------------------------------------

#: Types of approval requests tied to an :class:`~attendance.models.Attendance` record.
RequestType = (
    ("LATE", "Late Check-in"),
    ("OUTSIDE_GEOFENCE", "Outside Geofence"),
    ("OT", "Overtime"),
    ("ADJUST", "Manual Adjustment"),
)

#: Workflow statuses for an :class:`AttendanceRequest`.
RequestStatus = (
    ("PENDING", "Pending"),
    ("APPROVED", "Approved"),
    ("REJECTED", "Rejected"),
)



