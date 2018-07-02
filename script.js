const chalk = require('chalk');

// throw new Error('fail');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
  console.log('hi');

  await timeout(1000);
  console.log('I am emulating terminal');

  await timeout(1000);
  console.log('In the browser');

  await timeout(1000);
  console.log(chalk.green('With colours and all!'));

  await timeout(1000);
})();
