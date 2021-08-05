'use strict'

const semver = require('semver')
const colors = require('colors/safe')
const log = require('@egg-cli-dev/log')

const LOWEST_NODE_VERSION = '12.0.0'

class Command {
  constructor(argv) {
    // log.verbose('Command contructor', argv)
    if (!argv) {
      throw new Error('参数不能为空！')
    }
    if (!Array.isArray(argv)) {
      throw new Error('参数必须为数组！')
    }
    if (argv.length < 1) {
      throw new Error('参数列表为空！')
    }
    this._argv = argv
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain = chain.then(() => this.checkNodeVersion())
      chain = chain.then(() => this.initArgs())
      chain = chain.then(() => this.init())
      chain = chain.then(() => this.exec())
      chain.catch((err) => {
        log.error(err.message)
      })
    })
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1]
    this._argv = this._argv.slice(0, this._argv.length - 1)
    // console.log(this._cmd, this._argv)
  }

  // 检查 node 版本号
  checkNodeVersion() {
    const currentVersion = process.version // 获取当前版本号
    const lowestNodeVersion = LOWEST_NODE_VERSION // 获取最低版本号
    // 比对校验版本号 -> semver
    if (!semver.gte(currentVersion, lowestNodeVersion)) {
      throw new Error(
        colors.red(`egg-cli 需要安装 v${lowestNodeVersion} 以上版本的 Node.js`),
      )
    }
  }

  init() {
    throw new Error('init 必须实现')
  }

  exec() {
    throw new Error('exec 必须实现')
  }
}

module.exports = Command
