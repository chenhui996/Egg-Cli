# cli 本地调试方法

cli 有多个本地调试的方法

## 软链接指向

- 由于本地有 **cli** 的源码文件。
  - 故只需要将 **cli 命令的软链接** 指向 '本地源码文件' 地址即可。
- 操作：
  - 1. 进入**含有** '本地源码文件' 的地址目录。
  - 2. 命令行安装：

```
$ npm i -g your-cli
```

- 随后执行 **$ which your-cli** 将看到提示信息：

```
$ which your-cli
/usr/local/bin/your-cli
```

- 可以看到，软链接指向已经指向本地 **/bin** 目录下的 **your-cli** 源码文件了。

> 随后执行 **your-cli** ，即表示：软链接至本地源码的文件，进行执行调试。
> 若想重新设置 **软链接** 为远程库，只需离开 **含有** '本地源码文件' 的地址目录，执行 **npm 全局安装** 即可。

## npm link

- 首先，移除 **your-cli**，进入 '本地源码文件目录'。
- 执行：

```
$ npm link
```

- 即可创建本地调试环境，提示为：

```
$ npm link
npm WARN egg-cli-test@1.0.1 No repository field.

up to date in 0.944s
found 0 vulnerabilities

/usr/local/bin/egg-cli-test -> /usr/local/lib/node_modules/egg-cli-test/bin/index.js
/usr/local/lib/node_modules/egg-cli-test -> /Users/chenhui/Downloads/repository_localhost/cli/egg-cli-test
```

- 可以看到，**软链接的指向** 已经指向 '本地的源码文件地址' 了。
