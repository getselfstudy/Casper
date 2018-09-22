"use strict";

const { resolve, join } = require("path");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { InjectManifest } = require("workbox-webpack-plugin");

const ENV = process.argv.find(arg => {
    return arg.includes("production");
})
    ? "production"
    : "development";
const ANALYZE = process.argv.find(arg => {
    return arg.includes("--analyze");
});
const OUTPUT_PATH = resolve("assets/components");
const INDEX_TEMPLATE = resolve("./src/index.html");

const webcomponentsjs = "./node_modules/@webcomponents/webcomponentsjs";

const polyfills = [
    {
        from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
        to: join(OUTPUT_PATH, "vendor"),
        flatten: true
    },
    {
        from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
        to: join(OUTPUT_PATH, "vendor", "bundles"),
        flatten: true
    },
    {
        from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
        to: join(OUTPUT_PATH, "vendor"),
        flatten: true
    }
];

const helpers = [
    {
        from: resolve("./src/vendor/babel-helpers.min.js"),
        to: join(OUTPUT_PATH, "vendor")
    },
    {
        from: resolve("./src/vendor/regenerator-runtime.min.js"),
        to: join(OUTPUT_PATH, "vendor")
    }
];

const assets = [
    {
        from: resolve("./src/manifest.json"),
        to: OUTPUT_PATH
    }
];

const commonConfig = merge([
    {
        entry: "./src/components/index.js",
        output: {
            path: OUTPUT_PATH,
            filename: "index.js"
        },
        resolve: {
            extensions: [".js", ".css", ".html"],
            modules: ["node_modules", join(__dirname, "node_modules")]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    // exclude: /node_modules/,
                    // We need to transpile Polymer, do not exclude node_modules
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                babelrc: true,
                                extends: join(__dirname + "/.babelrc"),
                                cacheDirectory: true,
                                envName: ENV
                            }
                        },
                        {
                            loader: "uglify-template-string-loader"
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "csscomb-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        }
    }
]);

const developmentConfig = merge([
    {
        devtool: "cheap-module-source-map",
        plugins: [
            new CopyWebpackPlugin(polyfills),
            new HtmlWebpackPlugin({
                template: INDEX_TEMPLATE
            })
        ],
        devServer: {
            contentBase: '.',
            publicPath: '/assets/components',
            compress: true,
            overlay: true,
            port: 3000,
            host: "0.0.0.0",
            historyApiFallback: true
        }
    }
]);

const analyzeConfig = ANALYZE ? [new BundleAnalyzerPlugin()] : [];

const productionConfig = merge([
    {
        devtool: "nosources-source-map",
        plugins: [
            new CleanWebpackPlugin([OUTPUT_PATH], { verbose: true }),
            new CopyWebpackPlugin([...polyfills, ...helpers, ...assets]),
            new HtmlWebpackPlugin({
                template: INDEX_TEMPLATE,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyCSS: true,
                    minifyJS: true
                }
            }),
            new InjectManifest({
                swSrc: resolve("src", "service-worker.js"),
                swDest: resolve(OUTPUT_PATH, "sw.js"),
                exclude: [/webcomponents-(?!loader).*\.js$/]
            }),
            //  new CompressionPlugin({ test: /\.js(\.map)?$/i }),
            ...analyzeConfig
        ]
    }
]);

module.exports = mode => {
    if (mode === "production") {
        return merge(commonConfig, productionConfig, { mode });
    }

    return merge(commonConfig, developmentConfig, { mode });
};
