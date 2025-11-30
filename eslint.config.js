import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    plugins: { js, react: pluginReact, jest: pluginJest },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      pluginJest.configs["flat/recommended"]
    ],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: { version: "detect" },
      jest: { version: "latest" }
    }
  }
]);
