# Booking Workflow Guide

## Spam Controls
- Public booking form requires a valid reCAPTCHA token.
- Submissions are rate limited via `ScopedRateThrottle` (`booking` scope).
- Staff roles (`advisor`, `branch_head`, `system_admin`) bypass throttling.

## Notification Logic
- Notifications are sent according to `BOOKING_NOTIFICATION_CHANNELS`.
- On creation, confirmation is emailed/SMS to the customer and branch staff.
- On status updates (approved, in_progress, completed, cancelled, rejected) customers are notified via configured channels.
- SMS requests are POSTed to `SMS_GATEWAY_URL` if configured.

## Related Guides
- [Customer Guide](../how-to/CUSTOMER_GUIDE.md)
- [Admin Dashboard](../how-to/ADMIN_DASHBOARD.md)
