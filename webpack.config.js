const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Webpack entry point.
  entry: './lib/event_tracker.js',

  // Output definition.
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'event_tracker.js',
    library: 'AngularTracking',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  // Define loaders for webpack transpilation.
  module: {
    loaders: [
      {test: path.join(__dirname, 'lib'), loader: 'babel-loader', query: { presets: ['es2015', 'stage-1'] }},
      {test: path.join(__dirname, 'lib'), loader: 'eslint-loader'},
    ],
  },
  ecmaFeatures: { modules: true },

  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
  ],

  // Only output warnings and errors.
  devServer: {
    stats: 'errors-only',
  },

  stats: {
    // Nice colored output
    colors: true,
  },

  // Create Sourcemaps for the bundle
  devtool: 'source-map',
};

