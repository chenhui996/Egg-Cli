'use strict'

module.exports = core

// require 支持的文件加载格式：.js/.json/.node
// .js   -> module.exports/exports
// .json -> JSON.parse
// .node -> process.dlopen (基本不用)
// .any  -> .js
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const log = require('@egg-cli-dev/log')

const constant = require('./const') // 环境变量
const pkg = require('../package.json')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
  } catch (e) {
    log.error(e.message)
  }
}

// 检查用户主目录
function checkUserHome() {
  if(!userHome || !pathExists(userHome)){
    throw new Error(colors.red('当前登陆用户主目录不存在'))
  }
}

// 检查 root 账户 -> 自动降级
function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck()
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
