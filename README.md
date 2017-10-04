# osm-p2p-sync

> Module + command line utility for synchronizing two [osm-p2p-db](https://github.com/digidem/osm-p2p-db) instances.

osm-p2p-db stores its map data in two different formats:

1. The internal storage format: a directory with a `log/` subdirectory holding a LevelDB.
2. The external sharing format: a file ('syncfile') that's a LevelDB tar'red and gzipped.

This utility will sync any pair of osm-p2p databases, regardless of which type
is passed in. This can be handy for, say, generating a sync file from your local
map data to share with someone else to sync into, e.g. [Mapeo
Desktop](https://github.com/digidem/mapeo-desktop).

## CLI Usage

```
USAGE: osm-p2p-sync TARGET-1 TARGET-2

  Sync two osm-p2p-db destinations.
  
  TARGET-{1,2} can either be an osm-p2p directory, or an osm-p2p sync file.

  The command will auto-detect syncfiles vs osm-p2p directories.

  If one of the destinations does not yet exist, include a trailing /
  character to indicate an osm-p2p directory is desired; otherwise a sync
  file will be created.

```

## API

```js
var sync = require('osm-p2p-sync')
```

### sync(dbPath1, dbPath2, cb)

Takes the file paths of two osm-p2p-db directories or syncfiles, and
synchronizes them. `cb` is called upon completion.

## Install

With [npm](https://npmjs.org/) installed, run..

### Module
```
$ npm install osm-p2p-sync
```

### Command Line Utility
```
$ npm install --global osm-p2p-sync
```

## License

ISC
