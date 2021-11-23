const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
    preset: "ts-jest/presets/default",
    testEnvironment: "node",
    modulePaths: [
        __dirname
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: "../../"}),
    testMatch: ["**/tests/**/*.test.ts"]
}