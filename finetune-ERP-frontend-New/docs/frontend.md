# Frontend Booking and Repairs

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
