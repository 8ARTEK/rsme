#!/usr/bin/env node

// Not using CLI in package.json due to https://github.com/fraserxu/electron-pdf/issues/216

const { spawn } = require('child_process');

const child = spawn('node', [
  './node_modules/electron-pdf/cli.js',
  `${__dirname}/../docs/index.html`,
  './docs/resume.pdf'
]);

child.stdout.on('data', data => {
  console.log(data.toString());
});

child.stderr.on('data', data => {
  console.log(data.toString());
});

// child.on('exit', code => {
//   console.log(`child process exited with code ${code.toString()}`);
// });
