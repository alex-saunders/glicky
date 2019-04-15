const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const base = require('./webpack.base');

module.exports = merge(base, {
  stats: 'verbose',
  entry: ['@babel/polyfill', './src/client/index.js'],
  devtool:
    process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  mode: 'development',
  devServer: {
    stats: 'minimal',
    contentBase: './dist/client',
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api', '/socket.io', '/sockjs-node'],
        target: 'http://localhost:5000'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./dist/client'], {
      root: process.cwd()
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      title:
        process.env.NODE_ENV === 'production' ? 'Glicky' : 'Development'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:
          JSON.stringify(process.env.NODE_ENV) || JSON.stringify('development')
      }
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [new BundleAnalyzerPlugin()]
      : [])
  ],
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, '../', 'dist', 'client')
  }
});
