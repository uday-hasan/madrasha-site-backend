import { defineConfig } from "vitest/config";
import path from "path";

// ================================
// VITEST CONFIGURATION
// ================================

export default defineConfig({
  test: {
    // Use jsdom environment for DOM testing (not needed here but good default)
    globals: true,

    // Run tests sequentially to avoid DB conflicts
    pool: "forks",

    // Setup file runs before each test file
    setupFiles: ["./src/tests/setup.ts"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "src/tests/**",
        "**/*.d.ts",
        "**/*.config.*",
        "prisma/**",
      ],
      // Minimum coverage thresholds — CI fails if below these
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },

    // Test file patterns
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
