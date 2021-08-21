'use strict'

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const glob = require('glob')
const ejs = require('ejs')
const semver = require('semver')
const userHome = require('user-home')
const Command = require('@egg-cli-dev/command')
const Package = require('@egg-cli-dev/package')
const log = require('@egg-cli-dev/log')
const {spinnerStart, sleep, execAsync} = require('@egg-cli-dev/utils')

const getProjectTemplate = require('./getProjectTemplate')

const TYPE_PROJECT = 'project'
const TYPE_COMPONENT = 'component'

const TEMPLATE_TYPE_NORMAL = 'normal'
const TEMPLATE_TYPE_CUSTOM = 'custom'

const WHITE_COMMAND = ['npm', 'cnpm']

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
      const projectInfo = await this.prepare()
      if (projectInfo) {
        log.verbose('projectInfo', projectInfo)
        this.projectInfo = projectInfo
        // 2. 下载模版
        await this.downloadTemplate()
        // 3. 安装模版
        await this.installTemplate()
      }
    } catch (error) {
      log.error(error.message)
      if (process.env.LOG_LEVEL === 'verbose') {
        console.log(error)
      }
    }
  }

  // 安装模版
  async installTemplate() {
    if (this.templateInfo) {
      if (this.templateInfo.type) {
        if (!this.templateInfo.type) {
          this.templateInfo.type = TEMPLATE_TYPE_NORMAL
        }
        if (this.templateInfo.type === TEMPLATE_TYPE_NORMAL) {
          // 标准安装
          await this.installNormalTemplate()
        } else if (this.templateInfo.type === TEMPLATE_TYPE_CUSTOM) {
          // 自定义安装
          await this.installCustomTemplate()
        } else {
          throw new Error('无法识别项目模版类型')
        }
      }
    } else {
      throw new Error('项目模版信息不存在！')
    }
  }

  checkCommand(cmd) {
    if (WHITE_COMMAND.includes(cmd)) {
      return cmd
    }
    return null
  }

  async execCommand(command, errMsg) {
    let ret
    if (command) {
      const cmdArray = command.split(' ')
      const cmd = this.checkCommand(cmdArray[0])
      if (!cmd) {
        throw new Error('命令不存在！ 命令：' + command)
      }
      const args = cmdArray.slice(1)
      ret = await execAsync(cmd, args, {
        stdio: 'inherit',
        cwd: process.cwd(),
      })
      if (ret !== 0) {
        throw new Error(errMsg)
      }
      return ret
    }
  }

  ejsRender(option) {
    const dir = process.cwd()
    return new Promise((resolve, reject) => {
      glob(
        '**',
        {
          cwd: dir,
          ignore: option.ignore,
          nodir: true,
        },
        (err, files) => {
          if (err) {
            reject(err)
          }
          Promise.all(
            files.map((file) => {
              // ejs 遍历渲染
              const filePath = path.join(dir, file)
              const projectInfo = this.projectInfo
              return new Promise((resolve1, reject1) => {
                ejs.renderFile(filePath, projectInfo, {}, (err, result) => {
                  if (err) {
                    reject1(err)
                  } else {
                    fse.writeFileSync(filePath, result)
                    resolve1(result)
                  }
                })
              })
            }),
          )
            .then(() => {
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
        },
      )
    })
  }

  async installNormalTemplate() {
    log.verbose('this.templateInfo', this.templateInfo)
    log.verbose('this.templateNpm', this.templateNpm)
    // 拷贝模版代码至当前目录
    let spinner = spinnerStart('正在安装模版...')
    await sleep()
    try {
      const templatePath = path.resolve(
        this.templateNpm.cacheFilePath,
        'template',
      )
      const targetPath = process.cwd()
      fse.ensureDirSync(templatePath)
      fse.ensureDirSync(targetPath)
      fse.copySync(templatePath, targetPath)
    } catch (error) {
      throw error
    } finally {
      spinner.stop(true)
      log.success('模版安装成功')
    }

    // ejs 模版渲染
    const ignore = ['node_modules/**', 'public/**']
    await this.ejsRender({ignore})

    const {installCommand, startCommand} = this.templateInfo
    // 依赖安装
    await this.execCommand(installCommand, '依赖安装过程失败！')
    // 启动命令执行
    await this.execCommand(startCommand, '项目启动过程失败！')
  }

  async installCustomTemplate() {
    console.log('安装自定义模版')
  }

  // 下载模版
  async downloadTemplate() {
    // 1. 通过项目模版 API 获取项目模版信息
    // 1.1 通过 egg.js 搭建一套后端系统
    // 1.2 通过 npm 存储项目模版
    // 1.3 将项目模版信息存储到 mongodb 数据库中
    // 1.4 通过 egg.js 获取 mongodb 中的数据并且通过 API 返回

    // * -----------------------------------------------------------------

    const {projectTemplate} = this.projectInfo
    const templateInfo = this.template.find(
      (item) => item.npmName === projectTemplate,
    )
    const targetPath = path.resolve(userHome, '.egg-cli-dev', 'template')
    const storeDir = path.resolve(targetPath, 'node_modules')
    const {npmName, version} = templateInfo

    const templateNpm = new Package({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: version,
    })
    this.templateInfo = templateInfo
    if (await templateNpm.exists()) {
      const spinner = spinnerStart('正在更新模版...')
      await sleep()
      try {
        // 更新 package
        await templateNpm.update()
      } catch (error) {
        throw error
      } finally {
        spinner.stop(true)
        if (await templateNpm.exists()) {
          log.success('更新模版成功')
          this.templateNpm = templateNpm
        }
      }
    } else {
      const spinner = spinnerStart('正在下载模版...')
      await sleep()
      try {
        // 安装 package
        await templateNpm.install()
      } catch (error) {
        throw error
      } finally {
        spinner.stop(true)
        if (await templateNpm.exists()) {
          log.success('下载模版成功')
          this.templateNpm = templateNpm
        }
      }
    }
  }

  // 准备阶段
  async prepare() {
    // 0. 判断项目模版是否存在
    const template = await getProjectTemplate()
    if (!template || template.length === 0) {
      throw new Error('项目模版不存在')
    }
    this.template = template
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
      // 2. 是否启动强制更新
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
        } else {
          return
        }
      }
    }
    return this.getProjectInfo()
  }

  async getProjectInfo() {
    function isValidName(v) {
      return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(
        v,
      )
    }

    let projectInfo = {}

    let isProjectNameValid = false

    if (isValidName(this.projectName)) {
      isProjectNameValid = true
      projectInfo.projectName = this.projectName
    }

    // 1. 选择创建项目或组件
    const {type} = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择初始化类型',
      default: TYPE_PROJECT,
      choices: [
        {
          name: '项目',
          value: TYPE_PROJECT,
        },
        {
          name: '组件',
          value: TYPE_COMPONENT,
        },
      ],
    })

    log.verbose('type', type)

    // 2. 获取项目的基本信息
    if (type === TYPE_PROJECT) {
      const projectNamePrompt = {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称',
        default: '',
        validate: function (v) {
          const done = this.async()
          setTimeout(function () {
            if (!isValidName(v)) {
              done('项目名称不合法')
              return
            }
            done(null, true)
          }, 0)
        },
        filter: function (v) {
          return v
        },
      }
      const projectPrompt = []
      if (!isProjectNameValid) {
        projectPrompt.push(projectNamePrompt)
      }
      projectPrompt.push(
        {
          type: 'input',
          name: 'projectVersion',
          message: '请输入项目版本号',
          default: '1.0.0',
          validate: function (v) {
            // return !!semver.valid(v)
            const done = this.async()
            setTimeout(function () {
              if (!!!semver.valid(v)) {
                done('版本号不合法')
                return
              }
              done(null, true)
            }, 0)
          },
          filter: function (v) {
            if (!!semver.valid(v)) {
              return semver.valid(v)
            } else {
              return v
            }
          },
        },
        {
          type: 'list',
          name: 'projectTemplate',
          message: '请选择项目模版',
          choices: this.createTemplateChoice(),
        },
      )
      const project = await inquirer.prompt(projectPrompt)
      projectInfo = {
        ...projectInfo,
        type,
        ...project,
      }
    } else if (type === TYPE_COMPONENT) {
    }

    if (projectInfo.projectName) {
      projectInfo.className = require('kebab-case')(
        projectInfo.projectName,
      ).replace(/^-/, '')
    }

    if (projectInfo.projectName) {
      projectInfo.version = projectInfo.projectVersion
    }

    // return 项目的基本信息（object）
    return projectInfo
  }

  createTemplateChoice() {
    return this.template.map((item) => ({
      value: item.npmName,
      name: item.name,
    }))
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
