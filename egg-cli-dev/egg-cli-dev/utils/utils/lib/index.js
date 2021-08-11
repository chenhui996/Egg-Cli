'use strict'

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function spinnerStart(msg, spinnerString = '|/-\\') {
  const Spinner = require('cli-spinner').Spinner

  const spinner = new Spinner(msg + ' %s')
  spinner.setSpinnerString(spinnerString)
  spinner.start()

  return spinner
}

async function sleep(timeout = 1000) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

module.exports = {isObject, spinnerStart, sleep}
