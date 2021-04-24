# Lerna

- 学习 Lerna 三部曲:
  - 作用。
  - 简介。
  - 用法。

## Lerna 作用

### 为什么要用 Lerna？

根据之前的学习，相信大家也碰到了以下痛点：

- **痛点一：重复操作**
  - 多 Package 本地 link。
  - 多 Package 依赖安装。
  - 多 Package 单元测试。
  - 多 Package 代码提交。
  - 多 Package 代码发布。
- **痛点二：版本一致性**
  - 发布时版本一致性。
  - 发布后相互依赖版本升级。

> package 越多，管理复杂度越高。

## Lerna 简介

- **Lerna** 是一个管理工具，用来优化项目。
  - 优化类型：'基于 **git+npm** 的多 **package**' 项目。

### 优势

- 大幅度减少重复操作。
- 提升操作的标准化。

> **Lerna** 是架构优化的产物，它揭示了一个架构真理：
>
> > 项目复杂度提升后，就需要对项目进行架构优化。
> > 架构优化的主要目标：往往都是以效能为核心。

## Lerna 用法

### Lerna 开发 CLI 流程（重点）

- **CLI** 项目初始化：
  - 初始化 **npm** 项目 ->
  - 安装 **Lerna** ->
  - **Lerna init** 初始化项目。
- 创建 **package**：
  - **lerna create** 创建 **Package** ->
  - **lerna add** 安装依赖 ->
  - **lerna link** 链接依赖。
- **CLI** 开发和测试：
  - **lerna exec** 执行 **shell** 脚本。
  - **lerna run** 执行 **npm** 命令。
  - **lerna clean** 清空依赖。
  - **lerna bootstrap** 重装依赖。
- **CLI** 的发布上线：
  - **lerna version bump version**。(提升版本号)
  - **lerna changed**。 (查看以上版本的所有变更)
  - **lerna diff**。 (查看 **diff**)
  - **lerna publish**。 (项目发布)
