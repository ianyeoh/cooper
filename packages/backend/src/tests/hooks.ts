import app from "@cooper/backend/src/server";
import serverConfig from "@cooper/backend/serverConfig.json";
import { Server } from "http";

let server: Server;


export const mochaHooks = {
    beforeAll: new Promise((resolve, reject) => {
        console.log("Pre-test: start server");
        const hostname = serverConfig.hostname;
        const port = serverConfig.port;
        server = app.listen(port, hostname, (err) => {
            if (err) reject(err);

            console.log("Server started successfully");
            resolve(null);
        });
    }),
    afterAll: new Promise((resolve, reject) => {
        console.log("Post-test: server teardown");
        server.close((err) => {
            if (err) reject(err);

            console.log("Server stopped successfully");
            resolve(null);
        });
    }),
};
