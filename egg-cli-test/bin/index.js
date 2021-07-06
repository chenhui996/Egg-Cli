#!/usr/bin/env node

const yargs = require('yargs/yargs')
const dedent = require('dedent') // 保证格式无缩进
const pkg = require('../package.json')

// const {hideBin} = require('yargs/helpers') // 参数解析

// const arg = hideBin(process.argv) // hideBin 帮助进行解析 process.argv 的内容

const cli = yargs()
const argv = process.argv.slice(2)

const context = {
  eggVersion: pkg.version,
}

cli
  .usage('Usage: $0 [command] <option>')
  .demandCommand(
    1,
    'A command is required. Pass --help to see all available commands and options',
  )
  .strict()
  .recommendCommands()
  .fail((err, msg) => {
    console.log('err', err)
  })
  .alias('h', 'help')
  .alias('v', 'version')
  .wrap(cli.terminalWidth())
  .epilogue(
    dedent`
      When a command fails, all logs are written to lerna-debug.log in the current working directory.

      For more information, find our manual at https://github.com/lerna/lerna
  `,
  )
  .options({
    debug: {
      type: 'boolean',
      describe: 'Bootstrap debug mode',
      alias: 'd',
    },
  })
  .option('registry', {
    type: 'string',
    describe: 'Define global registry',
    // hidden: true,
    alias: 'r',
  })
  .group(['debug'], 'Dev Option')
  .group(['registry'], 'Extra Option')
  .command(
    'init [name]',
    'Do init a project',
    (yargs) => {
      yargs.option('name', {
        type: 'string',
        describe: 'Name of a project',
        alias: 'n',
      })
    },
    (argv) => {
      console.log(argv)
    },
  )
  .command({
    command: 'list',
    aliases: ['ls', 'la', 'll'],
    describe: 'List local packages',
    builder: (yargs) => {},
    handler: (argv) => {
      console.log(argv)
    },
  })
  .parse(argv, context)
