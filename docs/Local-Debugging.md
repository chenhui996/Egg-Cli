# cli 本地调试方法

cli 有多个本地调试的方法

## 软链接指向

- 由于本地有 **cli** 的源码文件。
  - 故只需要将 **cli 命令的软链接** 指向 '本地源码文件' 地址即可。
- 操作：
  1. 进入**含有** '本地源码文件' 的地址目录。
  2. 命令行安装：

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

## 分包情况

若脚手架项目相对比较复杂，不止一个包，出现了所谓的 **分包** 现象。

这种情况如何进行 **本地间** 的调试呢？

接下来让我们进行 **详细模拟** 分包情况下的 **本地调试**。

---

首先，我们需要 **多个包**:

1. 在 **your-cli** 的上级目录下，也就是同级新建 **your-cli-lib** 文件夹。
2. 进行包的初始化：**$npm init -y**。
3. 在 **your-cli-lib** 目录下，创建 '源码目录' 及 '源码文件'：**lib/index.js**。
   - 进入 **index.js**，填充源码：

```js
// 简单的导出一个方法
module.exports = {
  sum(a, b) {
    return a + b
  },
}
```

> 至此，新包简单配置完毕

---

接下来，我们需要完成：直接从本地的 **your-cli** 源码文件中调用另一个包（也就是上面创建的**your-cli-lib**）

首先，若是 **your-cli-lib** 已经发布到 **npm** 上，那我们执行 **npm i xxxxx** 下载安装，使用即可。

但我们是进行 '分包的本地调试' ，故我们要思考：

如何在还没将 **your-cli-lib** 发布到 **npm** 之前，也能进行 '本地的分包调试' 呢？

- 首先，我们进入到 **your-cli-lib** 目录下，命令行执行：**$npm link**。
  - 目的是：
    - 将 **your-cli-lib** 在全局的 **/usr/local/lib/node_modules** 目录下创建软链接。
      - 指向我们的本地源码文件：

```
your-cli-lib -> /Users/chenhui/Downloads/repository_localhost/cli/your-cli-lib
```

- 使得我们的 **your-cli-lib** 命令能够像正常的：通过 **npm i -g xxxx** 下载的包一样，本地可以直接使用。
- 接着，我们就可以进入到 **your-cli** 的目录下，通过执行命令：

```
$npm link your-cli-lib
```

- 执行成功后，我们就已经将 **your-cli-lib** 这个包，链接到我们 **your-cli** 的本地了。
  - 我们在本地就可以使用这个库了。

---

- 由于 **npm** 远程安装不可用，故需进入 **your-cli** 目录下的 **package.json**，手动引入 **your-cli-lib** 这个包：

```json
{
  //...
  "dependencies": {
    "your-cli-lib": "^1.0.0"
  }
}
```

- 手动引入完成后，我们还需进入 **your-cli-lib** 目录下的 **package.json** 中，将 **main** 配置的文件路径设置正确(入口文件)：

```json
{
  // ...

  "main": "lib/index.js"

  // ...
}
```

- 配置完成后，我们就可以在 **your-cli** 的源码 **js** 文件中使用 **your-cli-lib** 的源码 **js** 文件了。
- 进入 **your-cli** 的源码 **js** 文件，进行简单的引用：

```js
#!/usr/bin/env node

// *-----------------------------------------

const lib = require('egg-cli-test-lib')
console.log(lib.sum(1, 2))

// *-----------------------------------------

console.log('welcome egg-cli-test-ass')
```

- 写完后，我们就可以在命令行执行 **your-cli** 的执行命令，执行后可以看到：

```
$ node bin/index.js
3
welcome egg-cli-test-ass
```

- 如上易知，我们已经拿到了 **your-cli-lib** 的源码 **js** 文件中的 **sum** 方法了。

- 本地分包调试成功！！！

---

- 接下来，我们 **your-cli-lib** 这个包开发好后，我们需要发布到 **npm** 上。
  - 记得与 **your-cli** 包用 **unlink** 命令解除链接，否则之后在 **your-cli** 中用 **npm** 下载的话，会报错。
    - 报错的原因：由于之前用了 **npm link** ，所以 **your-cli** 始终认为， **your-cli-lib** 在我们的本地。
  - 操作：

```
$npm unlink your-cli-lib
```

- 接下来，让我们移除 **your-cli-lib** 的软链接，之后通过 **npm** 进行下载安装使用。

```
$npm remove -g your-cli-lib
```

- 最后，将 **your-cli-lib** 包发布到 **npm** 后，由于之前我们已经在 **your-cli** 的 **package.json** 中，手动引入过包了。
  - 故，我们直接通过 **npm** 命令下载 **your-cli-lib** 包即可使用。

```
$npm i
```

> 若发现 **dependencies** 手动引入未保存，可直接通过 **npm** 下载，或自行再手动引入一遍。

- 执行完后，发现目录下多了 **node_modules** 目录，其目录下即存有我们安装的 **your-cli-lib** 源码 **js** 文件。
- 最后的最后，在执行 **your-cli** 的执行命令，就不会报错，显示：

```
$ your-cli
3
welcome egg-cli-test-ass
```

**至此，分包调试，深入详解结束**

> tips：记得将开发好的两个包，分别 **publish** 到 **npm** 上。
