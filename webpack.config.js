const path = require('path');
const webpack = require('webpack');
require('bootstrap');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", 
        })
    ],
    mode: 'development'
};