# Playwright Demo

End-to-end tests for the [QA Practice](https://qa-practice.razvanvancea.ro) login page, built with Playwright and the Page Object pattern.

## Prerequisites

- Node.js (LTS)
- npm

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install Playwright browsers** (first time only)

   ```bash
   npx playwright install
   ```

3. **Configure environment**

   Copy `.env.example` to `.env` and add your credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   - `LOGIN_EMAIL` – valid login email (required)
   - `LOGIN_PASSWORD` – valid login password (required)
   - `BASE_URL` – base URL for the app (optional; defaults to https://qa-practice.razvanvancea.ro)

   The `.env` file is gitignored and will not be committed.

## Running Tests

```bash
npx playwright test
```

Tests run in **headless mode** and **concurrently** by default.

### Useful Commands

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run all tests |
| `npx playwright test --project=chromium` | Run tests in Chromium only |
| `npx playwright test --headed` | Run in headed mode (browser visible) |
| `npx playwright test --headless` | Run in headless mode (default) |
| `npx playwright show-report` | Open the last HTML report |

## Project Structure

```
playwright-demo/
├── config/
│   └── env.ts               # Environment config (reads from .env)
├── pages/
│   └── LoginPage.ts         # Login page object
├── tests/
│   └── loginPage.spec.ts
├── .env.example             # Template for required env vars
├── playwright.config.ts
└── package.json
```

## Test Coverage

- **Login happy path** – valid credentials, successful login
- **Invalid password** – error message displayed, no login
- **Invalid email** – error message displayed, no login

## Configuration

| Setting | Default |
|---------|---------|
| Browsers | Chromium, Firefox, WebKit |
| Headless | `true` (headless by default) |
| Workers | Default (concurrent) |
| Base URL | https://qa-practice.razvanvancea.ro |
