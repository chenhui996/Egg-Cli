'use strict'

module.exports = core

// require 支持的文件加载格式：.js/.json/.node
// .js   -> module.exports/exports
// .json -> JSON.parse
// .node -> process.dlopen (基本不用)
// .any  -> .js
const pkg = require('../package.json')
const semver = require('semver')
const colors = require('colors/safe')

const log = require('@egg-cli-dev/log')
const constant = require('./const') // 环境变量

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
  } catch (e) {
    log.error(e.message)
  }
}

// 检查 node 版本号
function checkNodeVersion() {
  const currentVersion = process.version // 获取当前版本号
  const lowestNodeVersion = constant.LOWEST_NODE_VERSION // 获取最低版本号
  // 比对校验版本号 -> semver
  if (!semver.gte(currentVersion, lowestNodeVersion)) {
    throw new Error(
      colors.red(`egg-cli 需要安装 v${lowestNodeVersion} 以上版本的 Node.js`),
    )
  }
}

// 检查版本号
function checkPkgVersion() {
  // console.log(pkg.version)
  log.success('cli start test', 'test success...')
  log.notice('cli', pkg.version)
}
