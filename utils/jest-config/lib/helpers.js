'use strict';

const { spawn } = require('child_process');

function runBin(path, args = [], env = process.env) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const bin = spawn(path, args, { env });

    bin.on('error', (error) => {
      reject(error);
    });

    bin.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    bin.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    bin.on('close', (code) => {
      if (stderr || code !== 0) {
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
