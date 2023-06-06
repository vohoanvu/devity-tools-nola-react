console.log("KARMA IS INSTALLED...");
const webpackConfig = require("./webpack.config.js");

module.exports = function(config) {
    config.set({
        plugins: [
            require("karma-jasmine"),
            require("karma-webpack"),
            require("karma-chrome-launcher")
        ],
        frameworks: ["jasmine"],
        files: [
        // Add your test files here
            "src/tests/*.test.js"
        ],
        preprocessors: {
        // Add webpack as preprocessor
            "src/tests/*.test.js": ["webpack"]
        },
        webpack: {
            ...webpackConfig,
            plugins: webpackConfig.plugins
        },
        reporters: ["progress"],
        browsers: ["Chrome"],
        singleRun: true
    });
};
