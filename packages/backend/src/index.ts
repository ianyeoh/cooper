import app from "@cooper/backend/src/server";
import serverConfig from "@cooper/backend/serverConfig.json";
// import { config } from "dotenv";

// config(); // Load variables from .env file into process.env

// Get configuration variables from environment
const hostname = serverConfig.hostname;
const port = serverConfig.port;

app.listen(port, hostname, () => {
    console.log();
    console.log(`[server]: Server is running at http://${hostname}:${port}`);
    console.log(
        `[server]: API documentation is available at http://${hostname}:${port}/docs`
    );
    console.log();
});
