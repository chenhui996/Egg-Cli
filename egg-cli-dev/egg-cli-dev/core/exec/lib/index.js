'use strict'

const Package = require('@egg-cli-dev/package')
const log = require('@egg-cli-dev/log')

const SETTINGS = {
  init: '@egg-cli-dev/init',
}

function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  log.verbose('-------------------------------------------------------')
  log.verbose('targetPath', targetPath)
  log.verbose('homePath', homePath)
  log.verbose('-------------------------------------------------------')
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name()
  const packageName = SETTINGS[cmdName]
  const packageVersion = 'latest'

  if (!targetPath) {
    // 生成缓存路径
    targetPath = ''
  }

  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion,
  })
  console.log(pkg.getRootFilePath())
  //   console.log(process.env.CLI_TARGET_PATH)
  //   console.log(process.env.CLI_HOME_PATH)
}

module.exports = exec
