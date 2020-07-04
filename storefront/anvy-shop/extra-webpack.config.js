const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = (config, options, targetOptions) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(pkg.version),
    })
  );

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      Assets: path.resolve(__dirname, 'src/assets/')
    }
  };

  console.log(config);

  return config;
};
