#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
require('../lib/index.js').run(process.env);
