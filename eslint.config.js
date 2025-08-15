// ESM
import next from "eslint-config-next";
import unused from "eslint-plugin-unused-imports";

export default [
  ...next,
  { ignores: [".next/*", "node_modules/*", "generated/*"] },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "unused-imports": unused },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  }
];
