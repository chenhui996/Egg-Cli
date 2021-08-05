'use strict'
const path = require('path')
const fse = require('fs-extra')
const pkgDir = require('pkg-dir').sync
const pathExists = require('path-exists').sync
const npminstall = require('npminstall')
const {isObject} = require('@egg-cli-dev/utils')
const formatPath = require('@egg-cli-dev/format-path')
const {
  getDefaultRegistry,
  getNpmLatestVersion,
} = require('@egg-cli-dev/get-npm-info')

class Package {
  constructor(options) {
    if (!options) {
      throw new Error('Package 类的 options 参数不能为空！')
    }
    if (!isObject(options)) {
      throw new Error('Package 类的 options 参数必须为对象！')
    }
    // package 的目标路径
    this.targetPath = options.targetPath
    // package 的缓存路径
    this.storeDir = options.storeDir
    // package 的 name
    this.packageName = options.packageName
    // package 的 version
    this.packageVersion = options.packageVersion
    // package 的缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_')
  }

  async prepare() {
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir)
    }
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName)
    }
  }

  get cacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`,
    )
  }

  getSpeficCacheFilePath(packageVersion) {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`,
    )
  }

  // 判断当前 Package 是否存在
  async exists() {
    if (this.storeDir) {
      await this.prepare()
      return pathExists(this.cacheFilePath)
    } else {
      return pathExists(this.targetPath)
    }
  }

  // 安装 Package
  async install() {
    await this.prepare()
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registpty: getDefaultRegistry(),
      pkgs: [{name: this.packageName, version: this.packageVersion}],
    })
  }

  // 更新 Package
  async update() {
    await this.prepare() 
    let latestPackageVersion = await getNpmLatestVersion(this.packageName)
    let latestFilePath = this.getSpeficCacheFilePath(latestPackageVersion)
    if (!pathExists(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registpty: getDefaultRegistry(),
        pkgs: [{name: this.packageName, version: latestPackageVersion}],
      })
      this.packageVersion = latestPackageVersion
    }
  }

  // 获取入口文件的路径
  getRootFilePath() {
    function _getRootFile(targetPath) {
      // 1. 获取 package.json 所在目录
      const dir = pkgDir(targetPath)
      // 2. 读取 package.json
      if (dir) {
        const pkgFile = require(path.resolve(dir, 'package.json'))
        // 3. 寻找 main/lib
        if (pkgFile && pkgFile.main) {
          // 4. 路径的兼容（macOS/windows）
          return formatPath(path.resolve(dir, pkgFile.main))
        }
      }
      return null
    }
    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath)
    } else {
      return _getRootFile(this.targetPath)
    }
  }
}

module.exports = Package
