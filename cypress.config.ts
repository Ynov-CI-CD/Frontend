import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost",
    viewportWidth: 1280,
    viewportHeight: 720,

    env: {
      apiUrl: "https://backend.integration-deploiement.strackzdev.com/api",
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
