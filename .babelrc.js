const helperWhitelist = require("./utils/helper-whitelist");

module.exports = {
    plugins: [
        ["@babel/external-helpers", { whitelist: helperWhitelist }],
        "@babel/syntax-dynamic-import",
        "@babel/transform-classes",
        "@babel/syntax-object-rest-spread",
        "@babel/transform-arrow-functions",
        "@babel/transform-async-to-generator",
        "@babel/transform-block-scoped-functions",
        "@babel/transform-block-scoping",
        "@babel/transform-computed-properties",
        "@babel/transform-destructuring",
        "@babel/transform-duplicate-keys",
        "@babel/transform-exponentiation-operator",
        "@babel/transform-for-of",
        "@babel/transform-function-name",
        "@babel/transform-instanceof",
        "@babel/transform-literals",
        "@babel/transform-modules-amd",
        "@babel/transform-object-super",
        "@babel/transform-parameters",
        "@babel/transform-regenerator",
        "@babel/transform-shorthand-properties",
        "@babel/transform-spread",
        "@babel/transform-sticky-regex",
        "@babel/transform-typeof-symbol",
        "@babel/transform-unicode-regex"
    ],
    env: {
        development: {
            plugins: ["@babel/transform-template-literals"]
        },
        production: {
            presets: [
                [
                    "minify",
                    {
                        evaluate: false,
                        mangle: false,
                        simplify: false
                    }
                ]
            ],
            plugins: [
                [
                    "template-html-minifier",
                    {
                        modules: {
                            "@polymer/polymer/lib/utils/html-tag.js": ["html"]
                        },
                        htmlMinifier: {
                            collapseWhitespace: true,
                            minifyCSS: true,
                            removeComments: true
                        }
                    }
                ],
                "@babel/transform-template-literals"
            ]
        }
    }
};
