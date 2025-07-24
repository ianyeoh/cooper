import { defineConfig } from "cypress";
// import codeCoverageTask from "@cypress/code-coverage/task";

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
      // codeCoverageTask(on, config);

      // implement node event listeners here
      return config;
    },
    // env: {
    //   codeCoverage: {
    //     url: "http://localhost:3000/api/__coverage__",
    //     coverage: true,
    //   },
    // },
  },
});
