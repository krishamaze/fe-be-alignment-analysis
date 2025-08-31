# UI Guide

## Viewport sizing

Use the `min-h-app` utility for full-height sections. It maps to `100dvh`,
preventing layout jumps when mobile browser chrome hides or shows.

## Navigation

Fixed headers should clear safe areas on notch devices. Apply
`pt-safe-header` (`calc(5rem + env(safe-area-inset-top))`) on top-level
containers to offset the header height and top inset.
