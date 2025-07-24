import app from "@cooper/backend/src/server";
import serverConfig from "@cooper/backend/serverConfig.json";
import enableConsoleCommands from "@cooper/backend/src/console";

// Get configuration variables from environment
const hostname = serverConfig.hostname;
const port = serverConfig.port;

const server = app.listen(port, hostname, () => {
  console.log();
  console.log(`[server]: Server is running at http://${hostname}:${port}`);
  console.log(`[server]: API documentation is available at http://${hostname}:${port}/docs`);

  enableConsoleCommands(server);
});
