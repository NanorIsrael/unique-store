// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/*.spec.ts"],
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // The test environment that will be used for testing
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/setupFiles.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTest.ts"],
};
