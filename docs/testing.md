# Testing

# References
- [Frontend Unit/Integration tests](#frontend-unitintegration-tests)
- [Frontend e2e tests](#frontend-e2e-tests)
- [Backend Unit/Integration tests](#backend-unitintegration-tests)
- [Backend e2e tests](#backend-e2e-tests)
- [Codecov](#swagger)
- [TSDocs](#tsdocs)
- [Swagger](#swagger)

## Frontend Unit/Integration tests

Both Angular test types use Karma, the only difference lies in their implementation methods. However, both contribute to the overall test coverage percentage.

![Image placeholder](img/front_unit_integration_tests.png)

## Frontend e2e tests

We implemented Cypress for end-to-end (E2E) testing in our Angular application, ensuring reliable and automated validation of user interactions and application behavior.

Note: The screenshot in this case is taken directly from the tests in GitHub Actions, allowing us to confirm that the E2E tests are functioning properly within the pipeline.

![Image placeholder](img/front_cypress_tests.png)

## Backend Unit/Integration tests

We implemented Jest for unit and integration testing in our NestJS application, ensuring efficient and reliable validation of individual components and system interactions.

![Image placeholder](img/back_unit_integration_tests.png)

## Backend e2e tests

We used Supertest with Jest for end-to-end (E2E) testing in our NestJS backend, ensuring robust and reliable API validation.

![Image placeholder](img/back_e2e_tests.png)

## Codecov

We used Codecov to publish the evolution of testing coverage.

![Image placeholder](img/codecov.png)

## TSDocs

We used TSDoc to document our code throughout the applications. Below, you can find some examples of how it's implemented:

![Image placeholder](img/tsdoc.png)

## Swagger

We used Swagger both as a testing tool and for documenting our NestJS API.

![Image placeholder](img/swagger.png)
