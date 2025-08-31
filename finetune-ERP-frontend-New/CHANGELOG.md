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
- Replace `min-h-screen` with `min-h-[100dvh]` in layout containers for mobile-friendly viewport sizing.
- Add safe-area inset padding to fixed navigation bars for better display on notch devices.
