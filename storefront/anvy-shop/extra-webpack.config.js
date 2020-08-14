const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const dotenv = require('dotenv');

dotenv.config();

const accessToken =  JSON.stringify(process.env.STOREFRONT_ACCESS_TOKEN);
const store =  JSON.stringify(process.env.SHOPIFY_STORE);

module.exports = (config, options, targetOptions) => {
  console.log('Using extra webpack config', targetOptions);

  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(pkg.version),
      API_URL: JSON.stringify('http://localhost:3001'),
      SHOPIFY_ACCESS_TOKEN: accessToken,
      SHOPIFY_STORE: store
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]);

  config.resolve.alias = {
    ...config.resolve.alias,
    '~assets': path.resolve(__dirname, 'src/assets')
  };

  // fixes WARNING Critical dependency: the request of a dependency is an expression
  config.externals = {
    ...config.externals,
    mongoose: 'commonjs mongoose'
  };

  return config;
};
