#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
require('../src/index.js').run(process.env, process.argv);
