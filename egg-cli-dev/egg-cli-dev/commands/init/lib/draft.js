'use strict'

const fs = require('fs')
const path = require('path')

const copyFolder = (srcDir, tarDir, cb) => {
  fs.readdir(srcDir, (err, files) => {
    let count = 0
    let checkEnd = () => {
      ++count == files.length && cb && cb()
    }
    if (err) {
      checkEnd()
      return
    }

    files.forEach((file) => {
      let srcPath = path.join(srcDir, file)
      let tarPath = path.join(srcDir, file)

      fs.stat(srcPath, (err, stats) => {
        if (stats.isDirectory()) {
          console.log('mkdir', tarPath)
          fs.mkdir(tarPath, (err) => {
            if (err) {
              console.log(err)
              return
            }
            copyFolder(srcPath, tarPath, checkEnd)
          })
        } else {
          copyFile(srcPath, tarPath, checkEnd)
        }
      })
    })
    files.length === 0 && cb && cb()
  })
}

const copyFile = () => {}
