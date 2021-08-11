'use strict'

const cp = require('child_process')
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
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name()
  const packageName = SETTINGS[cmdName] // init 的包名
  const packageVersion = 'latest'

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR)
    storeDir = path.resolve(targetPath, 'node_modules')
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    })
    if (await pkg.exists()) {
      // 更新 package
      console.log('更新 package')
      await pkg.update()
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
    try {
      // 在当前进程中调用
      // require(rootFile).call(null, Array.from(arguments))
      // 在 node 子进程中调用
      const args = Array.from(arguments)
      const cmd = args[args.length - 1]
      const o = Object.create(null)
      Object.keys(cmd).forEach((key) => {
        if (
          cmd.hasOwnProperty(key) &&
          key !== 'parent' &&
          !key.startsWith('_')
        ) {
          o[key] = cmd[key]
        }
      })
      args[args.length - 1] = o
      const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`
      const child = spawn('node', ['-e', code], {
        cwd: process.cwd(), // 当前命令行所处路径（动态）
        stdio: 'inherit',
      })
      child.on('error', (e) => {
        log.error(e.message)
        process.exit(1)
      })
      child.on('exit', (e) => {
        log.notice('命令执行成功', e)
        process.exit(0)
      })
    } catch (error) {
      log.error(error.message)
    }
  }
}

function spawn(command, args, options) {
  const win32 = process.platform === 'win32'
  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c'].concat(cmd, args) : args

  return cp.spawn(cmd, cmdArgs, options || {})
}

module.exports = exec
