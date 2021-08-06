'use strict'

const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const Command = require('@egg-cli-dev/command')
const log = require('@egg-cli-dev/log')

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || ''
    this.force = this._cmd.force
    log.verbose('projectName', this.projectName)
    log.verbose('force', !!this.force)
  }

  async exec() {
    try {
      // 1. 准备阶段
      const ret = await this.prepare()
      if (ret) {
        // 2. 下载模版
        // 3. 安装模版
      }
    } catch (error) {
      log.error(error.message)
    }
  }

  // 准备阶段
  async prepare() {
    // 1. 判断当前目录是否为空
    const localPath = process.cwd()
    if (!this.isDirEmpty(localPath)) {
      // 交互：询问是否继续创建
      let ifContinue = false
      if (!this.force) {
        ifContinue = (
          await inquirer.prompt({
            type: 'confirm',
            name: 'ifContinue',
            default: false,
            message:
              '当前文件夹不为空，是否继续创建项目？（继续创建将清空当前文件夹）',
          })
        ).ifContinue
        if (!ifContinue) {
          return
        }
      }
      if (ifContinue || this.force) {
        // 启动强制更新 -> 二次确认
        const {confirmDelete} = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          message: '是否确认清空当前目录下的文件？',
        })
        if (confirmDelete) {
          // 启动强制更新 -> 清空当前目录
          fse.emptyDirSync(localPath)
        }
      }
    }
    // 2. 是否启动强制更新
    // 3. 选择创建项目或组件
    // 4. 获取项目的基本信息
  }

  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath)
    // 文件过滤逻辑 -> 根据需求自行定制
    fileList = fileList.filter(
      (file) => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0,
    )
    return !fileList || fileList.length <= 0
  }
}

function init(argv) {
  // console.log('init', projectName, cmdObj.force, process.env.CLI_TARGET_PATH)
  return new InitCommand(argv)
}

module.exports = init
module.exports.InitCommand = InitCommand
