'use strict'

module.exports = core

// require 支持的文件加载格式：.js/.json/.node
// .js   -> module.exports/exports
// .json -> JSON.parse
// .node -> process.dlopen (基本不用)
// .any  -> .js
const pkg = require('../package.json')
const log = require('@egg-cli-dev/log')

function core() {
  checkPkgVersion()
}

// 检查版本号
function checkPkgVersion() {
  // console.log(pkg.version)
  log.success('cli start test', 'test success...')
  log.notice('cli', pkg.version)
}
