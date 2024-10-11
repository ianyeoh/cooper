import { loadEnvConfig } from "@next/env";

/* Loads variables from .env file in repository root */

const projectDir = process.cwd();
loadEnvConfig(projectDir);
