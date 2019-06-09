#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
require('../dist/index.js').run(process.env);
