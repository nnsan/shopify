const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = (config, options, targetOptions) => {
  console.log('Using extra webpack config', targetOptions);

  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(pkg.version),
    })
  ]);

  // fixes WARNING Critical dependency: the request of a dependency is an expression
  config.externals = {
    ...config.externals,
    mongoose: 'commonjs mongoose'
  };

  return config;
};
