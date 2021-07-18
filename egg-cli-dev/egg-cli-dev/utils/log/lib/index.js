'use strict'

const log = require('npmlog')

// 由环境变量决定：log.level
// 环境变量：process.env
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'

log.heading = 'egg' // 加前缀
log.headingStyle = {fg: 'black', bg: 'green'}
log.addLevel('success', 2000, {fg: 'green', bold: true}) // 添加自定义命令

module.exports = log
