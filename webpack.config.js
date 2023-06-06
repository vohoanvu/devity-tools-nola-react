const webpack = require("webpack");

module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            path: require.resolve("path-browserify"),
            fs: false,
            vm: false,
            buffer: require.resolve("buffer/"),
            util: require.resolve("util/"),
            os: false,
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            http: false,
            child_process: false,
            https: false,
            url: require.resolve("url/"),
            net: false,
            tls: false,
            assert: false,
            zlib: false,
            canvas: require.resolve("canvas"),
            process: require.resolve("process/browser")
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env),
        })
    ]
};
  