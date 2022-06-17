module.exports = {
    preset: "ts-jest/presets/default",
    testEnvironment: "jest-environment-jsdom",
    moduleDirectories: ["node_modules", "src"],
    modulePaths: [__dirname],
    testRegex: "(/tests/.*|(\\.|/)(test))\\.ts$",
    transform: {
        "^.+\\.vue$": "@vue/vue3-jest",
        "^.+\\.ts$": "ts-jest",
    },

    moduleFileExtensions: ["vue", "js", "ts"],
    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
    },
};
