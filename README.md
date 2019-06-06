# Electron Builder Demo

## 验证内容

* 打包成安装程序 👍
* 自动增量更新 👍
* 将指定内容排除在安装程序之外 👍
  * 开发文档 👍
  * 涉密内容 👍
* 将指定内容排除在 asar 包之外 👍
* spawn Node 后台进程 👍
  * 处理 Node 子线程的标准输出 👍
* PUBLISH 服务器和发布工具 👍
  * 简单的身份验证 👍

## 实际使用时的注意事项

* PUBLISH 服务器 应该放在一个 https 的反向服务器后面
* 分清楚 Node 进程和 Electron 进程

## TODO

* Node 进程项目和 Electron 进程项目共享同一个 node_modules, 这样可能会产生问题
