var fs = require('fs')
var sneakernet = require('hyperlog-sneakernet-replicator')
var eos = require('end-of-stream')
var Path = require('path')
var OsmP2P = require('osm-p2p')
var level = require('level')
var hyperlog = require('hyperlog')
var memdb = require('memdb')

module.exports = sync

function sync (a, b, cb) {
  getInfo(a, done.bind(null, 0))
  getInfo(b, done.bind(null, 1))

  var info = []
  var pending = 2
  function done (idx, err, details) {
    console.log(idx, details)
    info[idx] = details
    if (!--pending) {
      doSync(info[0], info[1], cb)
    }
  }
}

function doSync (a, b, cb) {
  if (a.type === 'dir' && b.type === 'dir') {
    return syncDirs(a.path, b.path, cb)
  } else if (a.type === 'dir' && b.type === 'file') {
    return syncFileDir(b.path, a.path, cb)
  } else if (a.type === 'file' && b.type === 'dir') {
    return syncFileDir(a.path, b.path, cb)
  } else if (a.type === 'file' && b.type === 'file') {
    return syncFiles(a.path, b.path, cb)
  }
}

function syncFiles (a, b, cb) {
  // 1. sync 'a' to an empty in-memory hyperlog
  var db = memdb()
  var hlog = hyperlog(db, { valueEncoding: 'json' })
  sneakernet(hlog, a, done1)

  function done1 (err) {
    if (err) return cb(err)

    // 2. now that 'a' is loaded into a hyperlog, sync it to 'b'
    sneakernet(hlog, b, done2)
  }

  function done2 (err) {
    if (err) return cb(err)

    // 3. now sync the in-mem hyperlog (which has a+b) back to 'a'
    sneakernet(hlog, a, cb)
  }
}

function syncFileDir (a, b, cb) {
  var db = level(Path.join(b, 'log'))
  var hlog = hyperlog(db, { valueEncoding: 'json' })
  sneakernet(hlog, a, function (err) {
    if (err) return cb(err)
    // close old db and regenerate indexes
    db.close(function (err) {
      if (err) return cb(err)
      var osm = OsmP2P(b)
      osm.ready(cb)
    })
  })
}

function syncDirs (a, b, cb) {
  var A = OsmP2P(a)
  var B = OsmP2P(b)
  var r1 = A.log.replicate()
  var r2 = B.log.replicate()

  eos(r1, predone.bind(null, A))
  eos(r2, predone.bind(null, B))

  r1.pipe(r2).pipe(r1)

  function predone (osm, err) {
    if (err) {
      pending = Infinity
      return cb(err)
    }
    // wait for indexes to regenerate
    osm.ready(done)
  }

  var pending = 2
  function done () {
    if (!--pending) {
      return cb()
    }
  }
}

function getInfo (p, cb) {
  fs.stat(p, function (err, stat) {
    if (err) return cb(err)
    if (!stat) {
      if (p.endsWith('/')) {
        return cb(null, { path: p, type: 'dir', exists: false })
      } else {
        return cb(null, { path: p, type: 'file', exists: false })
      }
    } else {
      if (stat.isDirectory()) {
        return cb(null, { path: p, type: 'dir', exists: true })
      } else {
        return cb(null, { path: p, type: 'file', exists: true })
      }
    }
  })
}
