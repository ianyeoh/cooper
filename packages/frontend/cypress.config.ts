import { defineConfig } from "cypress";

export default defineConfig({
  // component: {
  //   devServer: {
  //     framework: "next",
  //     bundler: "webpack",
  //   },
  // },
  e2e: {
    supportFile: false,
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@cypress/code-coverage/task")(on, config);

      // implement node event listeners here
      return config;
    },
  },
});
