# Frontend Booking and Repairs

## Home Page Quick Actions

- The `QuickActionsReel` component displays a "Most Popular Repairs" heading,
  three pricing cards and a footer link to view all repair services.
- Each card links to `/repair?service=<type>` to prefill the booking form.
- Cards use large rounded corners (`rounded-2xl`) and hover shadows for visual emphasis.
- The home page uses a `scroll-snap` container (`scrollSnapType: 'y mandatory'`)
  where each reel (`HeroReel`, `QuickActionsReel`, `TestimonialsReel`) fills the
  viewport minus navigation heights for an Instagram-style experience.
- `TestimonialsReel` links to Google Reviews via "Read All Reviews on Google" for full customer feedback.

## Booking Form

- Issues are loaded dynamically from `/api/issues` and selected via a multi-select.
- Default intake questions come from `/api/questions?question_set_name=INTAKE_DEFAULT` and render as text or choice inputs.
- Submissions send a nested payload with booking info, issues, other issues and responses.

```
{
  "booking": { "name": "John", "email": "j@e.com" },
  "details": { "date": "2024-01-01", "time": "10:00", "message": "hi" },
  "issues": [1],
  "other_issues": ["cracked back"],
  "responses": [{ "question": 1, "answer": "yes" }]
}
```

## Dashboard Routes

- `/dashboard/repairs/issues`
- `/dashboard/repairs/other-issues`
- `/dashboard/repairs/questions`

## Related Guides

- [Frontend Security](SECURITY.md)
- [Architecture](ARCHITECTURE.md)
