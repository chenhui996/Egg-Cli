const ejs = require('ejs')
const path = require('path')

const html = '<div><%= user.name %></div>'
const options = {}
const data = {
  user: {
    name: 'cain',
  },
}
const data2 = {
  user: {
    name: 'lc',
  },
}

// template 三种用法：

// * ---------------------------------------------------------------------

// 第一种：ejs.compile： 返回 function，用于解析 heml 中的 ejs 模版
const template = ejs.compile(html, options) // 拿到模版
const compileTemplate = template(data) // 配置模版 -> 塞内容
const compileTemplate2 = template(data2) // 配置模版 -> 塞内容

console.log(compileTemplate)
console.log(compileTemplate2)

// * ---------------------------------------------------------------------

// 第二种：ejs.render:直接渲染
const renderedTemplate = ejs.render(html, data, options)
console.log(renderedTemplate)

// * ---------------------------------------------------------------------

// 第三种：rednerFile
// 3.1
const renderedFile = ejs.renderFile(
  path.resolve(__dirname, 'template.html'),
  data,
  options,
)
renderedFile.then((file) => console.log(file))

// 3.2
ejs.renderFile(
  path.resolve(__dirname, 'template.html'),
  data,
  options,
  (err, file) => {
    console.log(file)
  },
)
