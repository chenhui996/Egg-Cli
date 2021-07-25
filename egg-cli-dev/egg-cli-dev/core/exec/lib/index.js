'use strict'

const path = require('path')
const Package = require('@egg-cli-dev/package')
const log = require('@egg-cli-dev/log')

const SETTINGS = {
  init: '@imooc-cli/init',
}

const CACHE_DIR = 'dependencies'

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  let storeDir = ''
  let pkg
  log.verbose('-------------------------------------------------------')
  log.verbose('targetPath', targetPath)
  log.verbose('homePath', homePath)
  log.verbose('storeDir', storeDir)
  log.verbose('-------------------------------------------------------')
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name()
  const packageName = SETTINGS[cmdName]
  const packageVersion = 'latest'
  log.verbose('-------------------------------------------------------')
  log.verbose('packageName', packageName)
  log.verbose('packageVersion', packageVersion)
  log.verbose('-------------------------------------------------------')

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR)
    storeDir = path.resolve(targetPath, 'node_modules')
    log.verbose('-------------------------------------------------------')
    log.verbose('targetPath', targetPath)
    log.verbose('storeDir', storeDir)
    log.verbose('-------------------------------------------------------')
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    })
    if (pkg.exists()) {
      // 更新 package
    } else {
      // 安装 package
      await pkg.install()
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    })
  }
  const rootFile = pkg.getRootFilePath()
  if (rootFile) {
    require(rootFile).apply(null, arguments)
  }
}

module.exports = exec
