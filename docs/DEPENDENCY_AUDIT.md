# Dependency Audit

Following consolidation of Python dependencies into `pyproject.toml`, the following duplicates were removed:

- `freezegun==1.5.5` – previously specified in both `requirements-dev.txt` and `finetune-ERP-backend-New/requirements-test.txt`

All dependencies now reside in `pyproject.toml` under `[project.optional-dependencies]`.
