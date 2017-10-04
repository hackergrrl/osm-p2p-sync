#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var args = require('minimist')(process.argv)
var sync = require('../')

if (args.h || args.help) {
  return exit(0)
}

if (args._.length !== 4) {
  return exit(0)
}

var src = args._[2]
var dst = args._[3]

sync(src, dst, function (err) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})

function exit (code) {
  fs.createReadStream(path.join(__dirname, 'USAGE'))
    .pipe(process.stdout)
  process.stdout.on('end', function () {
    process.exit(code)
  })
}
