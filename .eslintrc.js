module.exports = {
    env: {
        browser: true, // Browser global variables like `window` etc.
        commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
        es6: true, // Enable all ECMAScript 6 features except for modules.
        jest: true, // Jest global variables like `it` etc.
        node: true // Defines things like process.env when generating through node
    },
    extends: [
        "react-app",
        "react-app/jest",
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        "react",
        "react-hooks",
        "jsx-a11y",
        "import"
    ],
    root: true, // For configuration cascading.
    rules: {
        "react/prop-types": 0,
        "indent": 1,
        "linebreak-style": ["error", (require("os").EOL === "\r\n" ? "windows" : "unix")],
        "quotes": [1, "double"],
        "no-debugger": 0
    },
    settings: {
        react: {
            version: "detect" // Detect react version
        }
    }
};