// 简单的导出一个方法
module.exports = {
  sum(a, b) {
    return a + b
  },
  init({option, param}){
    console.log("执行 init 流程:", option, param);
  }
}
