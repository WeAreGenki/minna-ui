'use strict';

const { spawn } = require('child_process');

function runBin(path, args = [], env = process.env) {
  return new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];

    const child = spawn(path, args, { env });

    child.on('error', /* istanbul ignore next */ (error) => {
      reject(error);
    });

    child.stdout.on('data', (data) => {
      stdout.push(data.toString());
    });

    child.stderr.on('data', (data) => {
      stderr.push(data.toString());
    });

    child.on('close', (code) => {
      if (stderr.length || code !== 0) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = {
  runBin,
};
