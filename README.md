# Group Project - Integration and Deployment

This is a YNOV School project aiming to test, build, and deploy a project, helping students to understand how it works in a real deployment chain from development to deployment.

# References
- [Important Links](#important-links)
- [Project Documentation](#project-documentation)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Project Evaluation](#project-evaluation)

## Important Links:

- Webapp (Github Pages): [Click Here](https://ynov-ci-cd.github.io/Frontend/)
- Auto-Generated Documentation (Webapp): [Click Here](https://ynov-ci-cd.github.io/Frontend/docs/)
- Swagger: [Click Here](https://backend.integration-deploiement.strackzdev.com/api)
- Codecov: [Click Here](https://app.codecov.io/gh/Ynov-CI-CD/Frontend)
- NPM Package: [Click Here](https://www.npmjs.com/package/integration-deploiement-personal-front)
- Github Repository Frontend: [Click Here](https://github.com/Ynov-CI-CD/Frontend)
- Github Repository Backend: [Click Here](https://github.com/Ynov-CI-CD/Backend)

**Note:** In the important links section, we mentioned the web app deployment on GitHub Pages, but we also have the deployment on Coolify: [Webapp](https://integration-deploiement.strackzdev.com/) & [Backend](https://backend.integration-deploiement.strackzdev.com).

## Project Documentation

- Docker Architecture: [Click Here](docs/architecture_docker.md)
- Global Testing: [Click Here](docs/testing.md)
- Deployment: [Click Here](docs/deployment.md)

## Task Distribution

### José
- Front-end development
- Unit and integration testing (front-end)
- GitLab CI/CD setup
- Management and deployment with Coolify
- General documentation
- Front-end documentation generation (TSDoc, etc.)
- Creating Dockerfiles
- Setting up Docker Compose
- Codecov integration
- Publishing the front-end on NPM

### Timothée
- Back-end development
- Unit and integration testing (back-end)
- End-to-end (E2E) testing (front-end/back-end)
- General documentation
- API documentation and management with OpenAPI
- Creating Dockerfiles
- Setting up Docker Compose

## Project Structure

The project is structured into two main repositories: the backend (NestJS) and the frontend (Angular). Both parts are organized into separate directories:

- `back`: Contains the backend code, including NestJS configuration, TypeScript source files, and test files.
- `front`: Contains the frontend code, including Angular configuration, TypeScript source files, and test files.

## Key Features

- Backend:
    - Built with NestJS, a progressive Node.js framework.
    - Uses TypeScript for type-safe development.
    - Implements a RESTful API for user management.
    - Includes unit tests, integration and end-to-end tests using Jest and supertest.

- Frontend:
    - Built with Angular, a popular TypeScript-based framework.
    - Uses Angular CLI for project setup and development.
    - Implements a user interface for managing users.
    - Includes unit tests, integration and end-to-end tests using Angular's testing framework.

## Project Evaluation

- Achieved nearly 100% code coverage through Unit Tests to validate the mechanics of specific features.
- Completed nearly 100% Integration Test coverage to ensure end-to-end functionality, including template changes and interactions.
- Automated the generation of functional documentation, a structured README, and coverage reports deployed to Codecov.
- Implemented a workflow encompassing testing, global deployment, and GitHub Pages integration.

**Bonus:**

- The UI/UX of our Angular application is designed to be visually appealing and user-friendly.
- The code is properly implemented and optimized on both the backend and frontend, ensuring smooth functionality across the entire application.
