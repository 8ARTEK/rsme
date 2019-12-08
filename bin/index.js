#!/usr/bin/env node

// const logFile = 'resume.log';

// const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const program = require('commander');
const chalk = require('chalk');
const shell = require('shelljs');
const pkg = require('../package.json');

function sanityCheck() {
  try {
    if (!fs.existsSync('package.json')) {
      console.log(chalk`Not in a proper project directory. Aborting.`);
      console.log(
        chalk`Make sure to {bold.rgb(200,200,200) \`rsme init\`} before performing other actions!`
      );
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
  }
}

function cloneRepo(dir) {
  const process = spawn('git', ['clone', 'git@github.com:brtstk/resume.git', dir]);

  // Symlink node_modules
  shell.exec(`ln -sfn $(npm root -g)/rsme/node_modules/ ${dir}/node_modules`);

  if (dir === '.') {
    console.log('✅   Directory clean, cloning ...');
  }

  process.on('exit', () => {
    console.log('✅   Example project cloned!');

    console.log('');
    console.log('->  Run `rsme start`');
    console.log('->  Edit ./src/resume.html');
    console.log('->  Edit ./src/styles/');
  });
}

function runCmd(command, params) {
  // https://stackoverflow.com/questions/7725809/preserve-color-when-executing-child-process-spawn#comment81972962_43375301
  process.env.FORCE_COLOR = true;
  const cmd = spawn(command, params, { env: process.env });

  // // Delete the logfile first
  // try {
  //   fs.unlinkSync(logFile);
  // } catch (err) {
  //   console.error(err);
  // }

  // const logStream = fs.createWriteStream(logFile, { flags: 'a' });

  // cmd.stdout.pipe(logStream);
  // cmd.stderr.pipe(logStream);

  cmd.stdout.on('data', data => {
    console.log(data.toString());
  });

  cmd.stderr.on('data', data => {
    console.log(data.toString());
  });

  // cmd.on('exit', function (code) {
  //   console.log('child process exited with code ' + code.toString());
  // });
}

function initProject(dir) {
  if (dir !== '.') {
    cloneRepo(dir);
    return true;
  }

  // Check if directory is clean, and clone the project repo
  fs.readdir('./', (err, files) => {
    try {
      if (!files.length) {
        cloneRepo(dir);
      } else {
        console.log('Directory not clean! Aborting.');
      }
    } catch (err) {
      console.error(err);
    }
  });

  return true;
}

program
  .name(chalk`{bold rsme}`)
  .usage(chalk`[command] [options]`)
  .version(pkg.version);

program
  .command('init [dir]')
  .description('initialize an example résumé')
  .action(opt => {
    const dir = opt || '.';
    initProject(dir);
  });

program
  .command('start')
  .description('start a local development server')
  .action(() => {
    sanityCheck();
    console.log(
      '🏃‍♂️  Dev Server running @ http://localhost:1985 🔥  Hot Reloading active!\n\nPress Ctrl + C to abort.'
    );
    runCmd('npm', ['run', 'start']);
  });

program
  .command('build')
  .description('build your résumé (HTML + PDF)')
  .action(() => {
    const texts = ['🛠  Building resume ...', '✏️  Writing resume ...', '🖨  Generating resume ...'];

    sanityCheck();
    console.log(texts[Math.floor(Math.random() * texts.length)]);
    runCmd('npm', ['run', 'build']);
    // console.log('Done! Check out ./docs');
  });

program
  .command('preview')
  .option('--pdf', 'preview only PDF')
  .description('preview your résumé (HTML + PDF)')
  .action(cmdObj => {
    sanityCheck();

    if (cmdObj.pdf) {
      console.log('🚀  Launching preview (PDF) ...');
      return runCmd('npm', ['run', 'preview:pdf']);
    }

    console.log('🚀  Launching preview ...');
    return runCmd('npm', ['run', 'preview']);
  });

// Help on no command
if (!process.argv.slice(2).length) {
  console.log(
    chalk`📘  {bold.rgb(200,200,200) RESUME} v${pkg.version}\n   A simple HTML & PDF resume generator\n`
  );
  program.outputHelp();
}

// Show this when command invalid
program.on('command:*', () => {
  console.error(
    'Invalid command: %s\n\nSee --help for a list of available commands.',
    program.args.join(' ')
  );
  // program.outputHelp();
});

program.parse(process.argv);
