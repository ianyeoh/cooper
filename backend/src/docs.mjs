import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const docsRouter = Router();

// Parses JSDoc comments automatically into Swagger API docs
const options = {
    failOnErrors: true, // Throw errors when parsing JSDoc into Swagger
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
        },
    },
    apis: ["./src/routes/*.mjs"],
};

const swaggerSpec = swaggerJSDoc(options);

docsRouter.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default docsRouter;
