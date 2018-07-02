#!/usr/bin/env node
const cp = require('child_process');
const server = require('../server');

console.log(process.cwd());
console.log('starting server');
server();
// child = cp.spawn('node ../server.js', ['--ansi'], {
//   shell: true
//   // cwd: '/home/user/directory'
// });

// child.stdout.on('data', data => {
//   console.log(data.toString());
// });
