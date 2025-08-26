# Contributing Guide

## Linting and Formatting

Run ESLint with Prettier to check code style:

```bash
npm run lint
```

To automatically fix common issues, use:

```bash
npm run lint -- --fix
```

Configure your editor to format on save using the repo's Prettier and ESLint settings.

## Git LFS

Large binary assets such as Photoshop files are stored using Git LFS.
Install and configure it before committing `.psd` files:

```bash
git lfs install
git lfs track "*.psd"
```

These commands create pointer files and update `.gitattributes` so that the
actual binaries reside in the LFS store.
