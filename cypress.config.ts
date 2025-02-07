import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    chromeWebSecurity: false,

    env: {
      apiUrl: "https://backend.integration-deploiement.strackzdev.com",
      disableGpu: true,
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
