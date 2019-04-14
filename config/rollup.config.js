const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
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
    json(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: ['src/server/index.js', 'node_modules/**'], // Default: undefined

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false // Default: true
    }),
    nodeResolve({
      jsnext: true,
      main: false
    })
  ],
  output: {
    file: 'dist/server/server.bundle.js',
    format: 'iife'
  }
};
