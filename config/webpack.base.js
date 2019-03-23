const path = require('path');
const merge = require('babel-merge');

const babelConfig = require('./babel.config');

module.exports = {
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../src/client/')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: merge(
            {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: 'last 2 versions'
                    }
                  }
                ]
              ]
            },
            babelConfig
          )
        }
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  }
};
