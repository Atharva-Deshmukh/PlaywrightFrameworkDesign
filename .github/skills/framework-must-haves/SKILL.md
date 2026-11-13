---
name: framework-must-haves
description: 'Checklist of what the Playwright framework in this repo must include (UI/API/hybrid tests, POM, fixtures, auth state reuse, reporting, CI/CD, Docker, parallel runs, scenarios to cover). Use when: planning or reviewing framework features, deciding what to build next, checking coverage against the must-have list. Triggers: "must haves", "framework checklist", "what is missing", "framework-must-haves"'
user-invocable: true
---

# Playwright Framework from Scratch

## Framework Overview

```text
Playwright Framework
│
├── POM
├── Components
├── Fixtures
├── Authentication
├── Reporting
├── CI/CD
├── Docker
├── Parallel Execution
├── Test Data
├── Environment Config
├── Logging
├── Retry Strategy
├── Framework Architecture
├── Folder Structure
├── Execution Strategy
└── Scalability
```

## Must-Haves

- UI Tests
- API Tests
- Login once, save auth state, reuse auth state
- Hybrid Tests
- POM + Design pattern
- Fixtures
- Authentication
- Sessions
- Test Data Management
- Reporting
- GitHub Actions CI/CD
- Docker
- Git
- Parallel Execution
- Cross Browser
- Performance test suite in the same framework
- Environment-wise configuration

## Scenarios to Cover

- Login
- Search
- Filters
- Tables
- Pagination
- Forms
- File Upload
- File Download
- Multi-page workflow

## Important to Cover

- Page Objects
- Reusable Components
- Clean Locators
- Assertions
