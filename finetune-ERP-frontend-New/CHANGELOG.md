# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Initial documentation scaffold.
- Apply #E2C33D accent to borders and active states; remove legacy blue and purple styles.
- Add Workledger dashboard tile and protected routes.
- Fix dashboard icon imports to ensure valid heroicon modules.
- Forward tile routes into `CardItem` so dashboard tiles navigate correctly.
- Route Giveaway Redemption through `FocusLayout` at `/giveaway-redemption` and make the layout title configurable.
- Improve desktop reel navigation by normalizing wheel sensitivity, attaching wheel listeners only on desktop devices, and preventing default only after significant wheel movement.
- Remove root scroll snapping to let `PageWrapper` control scroll behavior.
- Add missing favicon asset and update reference in `index.html`.
- Fetch users via RTK Query with built-in pagination.
- Lazy-load route components to reduce initial bundle size.
