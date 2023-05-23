const webpackConfig = require("./webpack.config.js");

module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine"],
        files: [
            { pattern: "src/**/*.test.js", watched: false },
        ],
        preprocessors: {
            "src/**/*.test.js": ["webpack", "sourcemap"],
        },
        webpack: webpackConfig,
        reporters: ["spec"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["ChromeHeadless"],
        singleRun: false,
        concurrency: Infinity,
    });
};