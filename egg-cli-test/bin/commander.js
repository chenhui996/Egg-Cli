#!/usr/bin/env node

const commander = require('commander')
const pkg = require('../package.json')

// 获取 commander 的单例
// const {program} = commander

// 手动实例化一个 Command 实例
const program = new commander.Command()

// 通过构造者方法 -> 以链式调用的方式 -> 完善 program 功能、信息
program
  .name(Object.keys(pkg.bin)[0])
  .usage('<command> [options]')
  .version(pkg.version)
  .option('-d, --debug', '是否开启调试模式', false)
  .option('-e, --envName <envName>', '获取环境变量名称')

// command 注册命令
const clone = program.command('clone <source> [destination]')
clone
  .description('clone a repository')
  .option('-f, --force', '是否强制克隆')
  .action((source, destination, cmdObj) => {
    console.log(source, destination, cmdObj.force)
  })

// addCommand 注册子命令
const service = new commander.Command('service')
service
  .command('start [port]')
  .description('start service at some port')
  .action((port) => {
    console.log('do service start', port)
  })
service
  .command('stop')
  .description('stop service')
  .action(() => {
    console.log('stop service')
  })

program
  .command('install [name]', 'install package', {
    executableFile: 'egg-cli-dev',
    // isDefault: true,
    hidden: true,
  })
  .alias('i')

// program
//   .arguments('<cmd> [options]')
//   .description('test command', {
//     cmd: 'command to run',
//     options: 'options for command',
//   })
//   .action((cmd, options) => {
//     console.log(cmd, options)
//   })

// 高级定制：自定义 help 信息
// program.helpInformation = () => {
//   return ''
// }
// program.on('--help', () => {
//   console.log('your help information')
// })

// 高级定制：实现 debug
program.on('option:debug', () => {
  // console.log('debug', program.opts().debug)
  if (program.opts().debug) {
    process.env.LOG_LEVEL = 'verbose'
  }
  // console.log(process.env.LOG_LEVEL);
})

// 高级定制：未知命令监听
program.on('command:*', (obj) => {
  console.error('未知的命令：' + obj[0])
  const availableCommands = program.commands.map((cmd) => cmd.name())
  console.log('可用命令：' + availableCommands.join(','))
})

program.addCommand(service).parse(process.argv)
