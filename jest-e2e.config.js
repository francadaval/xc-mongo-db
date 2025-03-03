let ts_jest = require('ts-jest');
let ts_config = require('./tsconfig.paths.json');

/** @type {import('jest').Config} */
const config = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testRegex: ".e2e-spec.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    moduleNameMapper: ts_jest.pathsToModuleNameMapper(
      ts_config.compilerOptions.paths,
      {
        prefix: "<rootDir>/"
      }
    )
}

module.exports = config;
