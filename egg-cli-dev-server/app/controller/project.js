'use strict';

const Controller = require('egg').Controller;
const mongo = require('../utils/mongo');

class ProjectController extends Controller {
  // 获取项目/组件的代码模版
  async getTemplate() {
    const { ctx } = this;
    const data = await mongo().query('project');
    console.log(data);
    ctx.body = data;
  }
}

module.exports = ProjectController;
