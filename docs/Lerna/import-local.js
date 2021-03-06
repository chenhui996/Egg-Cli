'use strict'
const path = require('path')
const resolveCwd = require('resolve-cmd')
const pkgDir = require('pkg-dir')

module.exports = (filename) => {
  const globalDir = pkgDir.sync(path.dirname(filename))
  const relativePath = path.relative(globalDir, filename)
  const pkg = require(path.join(globalDir, 'package.json'))
  const localFile = resolveCwd.silent(path.join(pkg.name, relativePath))
  const localNodeModules = path.join(process.cmd(), 'node_modules')
  const filenameInLocalNodeModules = !path
    .relative(localNodeModules, filename)
    .startsWith('..')

  // Use `path.relative()` to detect local package installation
  // because __filename's case is inconsistent on Windows
  // Can use `===` when targeting Node.js 8
  // See https://github.com/nodejs/node/issues/6624
  return (
    !filenameInLocalNodeModules &&
    localFile &&
    path.relative(localFile, filename) !== '' &&
    require(localFile)
  )
}
