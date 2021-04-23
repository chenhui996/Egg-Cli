#!/usr/bin/env node

// *----------------------------------------------

const lib = require('egg-cli-test-lib')
const argv = require('process').argv

// *----------------------------------------------

// 执行 cli 的执行命令时，所执行的所有行为：$your-cli command [option] <params>
// console.log(require('process').argv)

// 0.node 1.your-cli 2~...custom 命令
const command = argv[2]
const options = argv.slice(3)

// *----------------------------------------------

// 实现参数解析 init --name

if (options.length > 1) {
  let [option, param] = options

  option = option.replace('--', '')

  if (command) {
    if (lib[command]) {
      lib[command]({option, param})
    } else {
      console.log('无效的命令')
    }
  } else {
    console.log('请输入命令')
  }
}

// *----------------------------------------------

// 实现参数解析 -- version

// 判断：若参数是以 '--' 或 '-' 开头，则视为全局参数
if (command.startsWith('--') || command.startsWith('-')) {
  const globalOption = command.replace(/--|-/g, '')
  // console.log(globalOption);
  if (globalOption === 'version' || globalOption === 'V') {
    console.log('v1.0.3')
  }
}
