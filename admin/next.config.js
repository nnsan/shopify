const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY);
const serverApi = JSON.stringify(process.env.SERVER_API);
const host = JSON.stringify(process.env.HOST);

module.exports = withCSS({
    webpack: (config) => {
        const env = {
            API_KEY: apiKey,
            SERVER_API: serverApi,
            HOST: host
        };
        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
    },
});
