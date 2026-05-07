import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["node_modules/", ".husky/", "dist/", "build/"] },
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": ["error", { "args": "none" }]
    }
  },
];
