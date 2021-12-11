module.exports = {
    preset: "ts-jest/presets/default",
    testEnvironment: "node",
    moduleDirectories: ["node_modules", "src"],
    modulePaths: [__dirname],
    testMatch: ["**/tests/**/*.test.ts"],
};
