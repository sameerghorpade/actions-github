// eslint.config.js (for Flat Config)
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js, react: pluginReact },
    extends: ["js/recommended", pluginReact.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      "react/react-in-jsx-scope": "off" // disable rule for React 17+
    },
    settings: {
      react: {
        version: "detect" // automatically detect React version
      }
    }
  }
]);
