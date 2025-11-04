# Finetune ERP Monorepo – AI Agent Guide

## 1. Monorepo Overview

This repository is a monorepo containing two main projects:

-   **`apps/backend/`**: A Django and Django REST Framework application that serves as the backend API.
-   **`apps/frontend/`**: A React application that provides the user interface.

This structure allows for shared configurations and streamlined development workflows.

## 2. Development Setup

To set up the development environment, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd <repo-directory>
    ```

2.  **Install backend dependencies**:
    ```bash
    pip install -e .[backend,dev,test]
    ```

3.  **Install frontend dependencies**:
    ```bash
    pnpm install --prefix apps/frontend
    ```

4.  **Configure environment variables**:
    ```bash
    cp env.example .env
    ```
    Update the `.env` file with the necessary credentials and settings for your local environment.

## 3. Build and Test Commands

### Backend

-   **Run tests**:
    ```bash
    pytest apps/backend/tests -q
    ```

-   **Run the development server**:
    ```bash
    python apps/backend/manage.py runserver
    ```

### Frontend

-   **Run tests**:
    ```bash
    pnpm --dir apps/frontend test
    ```

-   **Run the development server**:
    ```bash
    pnpm --prefix apps/frontend dev
    ```

## 4. Tooling and Dependencies

-   **Backend**:
    -   **Django**: The core web framework.
    -   **Django REST Framework**: For building the REST API.
    -   **pytest**: The testing framework.
    -   **Black**: The code formatter.

-   **Frontend**:
    -   **React**: The JavaScript library for building user interfaces.
    -   **Vite**: The build tool and development server.
    -   **pnpm**: The package manager.
    -   **ESLint**: The linter for identifying and fixing problems in JavaScript code.

## 5. Environment Variables

The following environment variables are required to run the application:

-   `DATABASE_URL`: The connection string for the PostgreSQL database.
-   `SECRET_KEY`: A secret key for a particular Django installation.
-   `CORS_ALLOWED_ORIGINS`: A list of origins that are authorized to make cross-site HTTP requests.
-   `CSRF_TRUSTED_ORIGINS`: A list of trusted origins for CSRF protection.

Refer to the `env.example` file for a complete list of environment variables.

## 6. Coding Standards

-   **Python**: Follow the [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide and use `black` for code formatting.
-   **JavaScript/React**: Follow the coding style enforced by ESLint and Prettier.

## 7. Subdirectory AGENTS.md

For more detailed information about each sub-project, refer to their respective `AGENTS.md` files:

-   [Backend AGENTS.md](./apps/backend/AGENTS.md)
-   [Frontend AGENTS.md](./apps/frontend/AGENTS.md)