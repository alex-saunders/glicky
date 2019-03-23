const rollup = require('rollup');
const chokidar = require('chokidar');

const config = require('./rollup.config');

// we just want to watch files initially - not compile them as
// this is handled by the yarn build:server command
// hence the `ignoreInitial: true` option
const watcher = chokidar.watch('src/server/**/*', {
  ignored: /(^|[/\\])\../,
  ignoreInitial: true,
  persistent: true
});

// eslint-disable-next-lin
console.log('Waiting for changes...');

watcher.on('all', async () => {
  const bundle = await rollup.rollup(config);
  await bundle.write(config.output);
});
