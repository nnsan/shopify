import withCSS from '@zeit/next-css';
import webpack from 'webpack';

import * as dotEnv from 'dotenv';
dotEnv.config();

const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY);
const serverApi = JSON.stringify(process.env.SERVER_API);

module.exports = withCSS({
    webpack: (config) => {
        const env = {
            API_KEY: apiKey,
            SERVER_API: serverApi
        };
        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
    },
});
