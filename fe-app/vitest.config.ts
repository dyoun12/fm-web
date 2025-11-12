import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const rootDir = fileURLToPath(new URL("./", import.meta.url));
const enableStorybook = process.env.STORYBOOK_VITEST === 'true';

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    coverage: {
      reporter: ["text", "html"]
    },
    include: ["app/**/*.test.ts", "app/**/*.test.tsx", "tests/**/*.test.ts"],
    ...(enableStorybook
      ? {
          projects: [
            {
              extends: true,
              plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
              test: {
                name: 'storybook',
                browser: {
                  enabled: true,
                  headless: true,
                  provider: playwright({}),
                  instances: [{ browser: 'chromium' }],
                },
                setupFiles: ['.storybook/vitest.setup.ts'],
              },
            },
          ],
        }
      : {}),
  },
  resolve: {
    alias: {
      "@": resolve(rootDir, ".")
    }
  }
});
