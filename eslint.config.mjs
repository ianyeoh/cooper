import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/",
      "**/build/",
      "**/.next/",
      "eslint.config.mjs",
      "**/*.js",
      "**/tailwind.config.ts",
      "**/next.config.mjs",
      "**/.nyc_output/",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
