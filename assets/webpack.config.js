var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var LiveReloadPlugin = require('webpack-livereload-plugin');

var path = require('path');

module.exports = {

  context: __dirname,

  entry: ['whatwg-fetch', "./js/application.es6"],
  output: {
    path: path.resolve(__dirname, "../priv/static"),
    filename: "js/app.js"
  },

  resolve: {
    extensions: ['.js', '.es6'],
    modules: [
      "node_modules",
      path.resolve(__dirname, "./js")
    ]
  },

  module: {
    rules: [
      {
        test: /\.(es6|jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // include: __dirname,
        query: {
          presets: ["es2015", "react", "react-optimize", "stage-0"]
        }
      }, {
      	test: /\.css$/,
        exclude: /node_modules/,
      	loader: ExtractTextPlugin.extract({use: 'css'})
      }, {
      	test: /\.json$/, loader: "json-loader",
        exclude: /node_modules/
   }]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({debug: true}),
    new ExtractTextPlugin("css/app.css"),
    new CopyWebpackPlugin([{from: "./static", to: path.resolve(__dirname, "../priv/static")}]),
    new webpack.ContextReplacementPlugin(/moment[\\\/]lang$/, /^\.\/(en-gb|de|pl)$/),
    new LiveReloadPlugin({appendScriptTag: true, hostname: 'lvh.me'})
  ]

};
