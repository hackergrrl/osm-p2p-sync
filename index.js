var fs = require('fs')
var sneakernet = require('hyperlog-sneakernet-replicator')
var mkdirp = require('mkdirp')
var eos = require('end-of-stream')

module.exports = sync

function sync (a, b, cb) {
  makeReplicationStream(a, done.bind(null, 0))
  makeReplicationStream(b, done.bind(null, 1))

  var streams = []
  var pending = 2
  function done (idx, stream) {
    streams[idx] = stream
    if (!--pending) {
      pipe(streams[0], streams[1], cb)
    }
  }
}

function pipe (a, b, cb) {
  eos(r1, done)
  eos(r2, done)

  r1.pipe(r2).pipe(r1)

  var pending = 2
  function done (err) {
    if (err) {
      pending = Infinity
      return cb(err)
    }
    if (!--pending) {
      return cb()
    }
  }
}

function makeReplicationStream (p, cb) {
  fs.stat(p, function (err, stat) {
    if (!stat) {
      console.log('no exist')
      if (p.endsWith('/')) {
        // Make a new osm-p2p directory.
        // ...
      } else {
        // Make a new sync file.
        // ...
      }
    } else {
      console.log('exists')
      if (stat.isDirectory()) {
        // Existing dir.
        // ...
      } else {
        // Existing sync file.
        // ...
      }
    }
  })
}
