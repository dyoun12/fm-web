// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Try to include Storybook's flat recommended config if available (version-safe)
const storybookRecommended =
  (storybook.configs &&
    (storybook.configs["flat/recommended"] || storybook.configs.recommended)) || [];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Storybook specific recommendations (no-op if not available)
  ...[].concat(storybookRecommended),

  // Global ignores (extend defaults from next config)
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional common ignores
    "coverage/**",
    "dist/**",
    ".storybook/**",
  ]),

  // Test files: set globals and relax a few noisy rules
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        // Vitest globals
        vi: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      // In tests it's common to have imports or vars only used in assertions
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
      "no-unused-expressions": "off",
    },
  },

  // Story files: relax UI-preview specific constraints
  {
    files: [
      "**/*.stories.ts",
      "**/*.stories.tsx",
      "**/*.stories.js",
      "**/*.stories.jsx",
      "**/*.stories.mjs",
      "**/*.stories.cjs",
    ],
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
    },
  },

  // Dev preview page: allow unused vars for showcasing data
  {
    files: ["app/dev/page.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);

export default eslintConfig;
