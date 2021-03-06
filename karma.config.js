// Karma configuration
var path = require('path');
var webpack = require('webpack');
var angular = require('angular');

module.exports = function(config) {
  config.set({
    // Enable Jasmine
    frameworks: ['jasmine'],

    // Load all specs (specs should import their test files from the lib)
    files: [
      'node_modules/angular/angular.js',
      'dist/event_tracker.js',
      //'test/**/*.spec.js',
      'test/event_tracker.spec.js'
    ],

    // Run webpack on specs.
    preprocessors: {
      'test/**/*.spec.js': ['webpack', 'sourcemap']
    },

    // Webpack config for specs
    webpack: {

      // Run babel-loader on each file
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015', 'stage-1'] }, include: /(lib|spec)/ },
          { test:  /\.js$/, loader: "eslint-loader", include: /(lib|spec)/ }
        ]
      },

      // Avoid publishing files when compilation fails
      plugins: [
        new webpack.NoErrorsPlugin(),
        //new webpack.DefinePlugin({
        //  CONFIG: JSON.stringify(require(path.join(__dirname, 'config', 'test'))),
        //})
      ],

      resolve: {
        // Setup lib and spec aliases
        alias: {
          lib:  path.join(__dirname, 'lib'),
          spec: path.join(__dirname, 'spec'),
        },
        extensions: ['', '.js'],

        // Enables `import React from 'react'`
        modulesDirectories: ['node_modules'],
      },

      // Create Sourcemaps for the bundle
      devtool: 'inline-source-map',
    },

    webpackServer: {
      stats: 'errors-only',
    },

    // More Karma configuration
    reporters: ['dots'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,

  });
};
