# FE-BE Alignment Analysis

This repository stores a combined snapshot of the frontend and backend codebases.

## GitHub Actions Workflow

The workflow in `.github/workflows/sync-repos.yml` clones the frontend and backend repositories and commits their content here.

### Required Repository Variables

- `FE_REPO_URL` – HTTPS URL of the frontend repository.
- `FE_BRANCH` – Branch of the frontend repository to sync.
- `BE_REPO_URL` – HTTPS URL of the backend repository.
- `BE_BRANCH` – Branch of the backend repository to sync.

### Required Repository Secrets

- `FE_READ_TOKEN` – Personal access token with read access to the frontend repository.
- `BE_READ_TOKEN` – Personal access token with read access to the backend repository.
- `ANALYSIS_WRITE_TOKEN` – Token with write access to this analysis repository.
