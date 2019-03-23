const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const { eslint } = require('rollup-plugin-eslint');

const babelConfig = require('./babel.config');

module.exports = {
  input: 'src/server/index.js',
  onwarn: function(message) {
    // Suppress this error message... it makes it hard to see error messages.
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if (message.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    console.error(message);
  },

  plugins: [
    eslint({
      throwOnError: true
    }),
    babel(babelConfig),
    commonjs()
  ],
  external: [
    'express',
    'path',
    'fs',
    'http',
    'socket.io',
    'child_process',
    'execa',
    'ps-tree',
    'chalk',
    'supports-color',
    '@babel/polyfill',
    'os',
    'ospath',
    'read-pkg-up',
    'write-pkg',
    'minimist'
  ],
  output: {
    file: 'dist/server/server.bundle.js',
    format: 'cjs'
  }
};
