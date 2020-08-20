const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'ShopifyService',
        libraryTarget: 'umd',
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false
    },
};
