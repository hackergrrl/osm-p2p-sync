#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var args = require('minimist')()
var sync = require('../')

if (args.h || args.help) {
  return exit(0)
}

if (args._.length !== 4) {
  return exit(0)
}

var src = args._[2]
var dst = args._[3]

sync(src, dst)

function exit (code) {
  fs.createReadStream(path.join(__dirname, 'USAGE'))
    .pipe(process.stdout)
  process.stdout.on('end', function () {
    process.exit(code)
  })
}
