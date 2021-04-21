# cli 的实现原理

## cli 的实现原理

如果你能回答以下 3 个问题，就掌握了 cli 的实现原理：

```
npm install -g @vue/cli
```

- 为什么全局安装 **@vue/cli** 后，操作系统中会添加一个 **vue** 的命令？（述说流程）
- 全局安装 **@vue/cli** 时发生了什么？（述说流程）
- 执行 **vue** 命令时发生了什么？为什么 **vue** 指向一个 **js** 文件，我们却可以直接通过 **vue** 命令去执行它？

---

### 为什么全局安装 **@vue/cli** 后，操作系统中会添加一个 **vue** 的命令？

全局安装 **@vue/cli** 后:
会在 本地全局 **node** 下的 **node-modules** 创建一个 **vue** 的软链接，指向：

```
vue -> ../lib/node_modules/@vue/cli/bin/vue.js
```

- 指向的地址即为： **vue** 的真身，也就是 **vue.js**。
  - 也就是说，我们真正执行的是，**vue.js** 文件，**vue** 只是一个软链接。

> 但是，为什么执行的是 **vue.js**，我们却可以用 **vue** 来执行呢？这两者的绑定关系从何而来？

原因是：

- 在源码目录，也就是 **cli** 目录下，有一个 **package.json** 的文件。
  - 在此文件下有一个配置项 **bin**，如下：

```json
{
  "bin": {
    "vue": "bin/vue.js"
  }
}
```

- 如上易知，在 **bin** 下配置了 **vue** 的配置项，将二者相关联了起来。
  - 使得 **/usr/local/bin** 下的 **vue** 命令可以链接到 **vue.js** 中去执行, 且配置好 **@vue/cli** 的执行命令。

> 若是安装完包后，想自定义**@vue/cli** 的执行命令，可修改 **/usr/local/bin** 下的 **vue** 名称，实现 '命令名称' 的更改。

### 全局安装 **@vue/cli** 时发生了什么？

上面其实，原理已经说的差不多了，我们从流程角度说说，全局安装 **@vue/cli** 时发生了什么：

全局安装 **@vue/cli** 时:
**node** 会将 **@vue/cli** 这个包放到 **/user/local/lib** 下的 **/node_modules** 当中。

- 当包完全下载完毕后：
  - **node** 会去解析 **/node_modules/@vue/cli** 下 **package.json** 文件中的 **bin** 配置。
  - 其中，找到 **"vue": "bin/vue.js"**，即为 **vue** 命令的配置项。
    - 随后在 **/usr/local/bin** 下根据 **bin** 对应的配置，配置好 **@vue/cli** 的执行命令名称和软链接。

### 执行 **vue** 命令时发生了什么？

命令行执行 **vue** 命令时：
其实相当于执行 **which vue** 找到的路径:

```
$ /usr/local/bin/vue
```

随后因为 vue 命令是一个软链接：

```
vue -> ../lib/node_modules/@vue/cli/bin/vue.js
```

故命令行执行 **vue** 命令，实则本质上是执行：

```
$ /usr/local/lib/node_modules/@vue/cli/bin/vue.js
```

### 为什么 **vue** 指向一个 **js** 文件，我们却可以直接通过 **vue** 命令去执行它？

承接上文，得出疑问：
为什么 **vue** 指向一个 **js** 文件，我们却可以直接通过 **vue** 命令去执行它？
毕竟平时命令行执行 **js** 文件，都是需要通过 **node** 去执行的，比如：

```
$ node xxx.js
```

---

原因： **vue.js** 文件的第一行标注了 **执行方法**：

```js
#!/usr/bin/env node

//...
```

这一句配置了执行方法，代表当我们操作系统 **命令行** 执行：

```
$ ./vue.js
```

调用这个文件时：

- 会去 **环境变量** 中找 **node** 命令：
  - 并使用找到的命令去执行此文件。
- 若是 **py** 文件，就写 **#!/usr/bin/env python**。

---

- 此时，我们已经可以通过 **./vue.js** 的方式去直接执行 **vue.js** 文件了。
  - 但是需求是直接用 **vue** 命令执行，怎么做呢？
    - 只需要去到 **/usr/local/bin** 目录下，创建一个名为 **vue** 的命令。
      - 而且**vue** 的命令实则为一个软链接，需指向 **../lib/node_modules/@vue/cli/bin/vue.js**。
- 所以一共需要两步：
  1. 创建一个名为 **vue** 的命令。
  2. 为 **vue** 命令设置软链接，指向 **../lib/node_modules/@vue/cli/bin/vue.js**。
- 具体操作如下:

```
$ ln -s /usr/local/lib/node_modules/@vue/cli/bin/vue.js vue
```

> 上述操作，推荐动手实践敲一敲，自己创建一个 **test.js** 去体验，加深理解。

---

#### 小知识点

记得，执行的 **js** 文件需要可执行权限，不然提示如下报错：

```
$ ./test.js
zsh: permission denied: ./test.js
```

---

添加权限：

```
$ chmod 777 test.js
```

随后用 **ll** 查看执行权限,即可看到：

```
$ ll
-rwxrwxrwx  1 chenhui  staff    48B  4 21 23:13 test.js
```
