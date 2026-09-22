/**
 * Jest config scoped to the `solutions/nest` workspace only.
 *
 * This file intentionally lives inside this folder (not at the repo root)
 * so it never interferes with the root `npm test` run. The root
 * `jest.config.js` restricts `roots` to `<rootDir>/tests`, so it will not
 * pick up this package or these specs. Run tests for this module from
 * *inside* this directory:
 *
 *   cd Node-Express-Nest/v1/solutions/nest
 *   npm install
 *   npx jest
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: __dirname,
  roots: ["<rootDir>"],
  testMatch: ["<rootDir>/task-*/**/*.spec.ts", "<rootDir>/task-*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true,
};
