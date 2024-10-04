###

使用 geek_crawler 项目下载 geek 时间 课程，保存在应用存储中， 即可下载读取， 包含音频。
课程资料，仅供学习研究

### 使用 node 18

nvm use 18

### 安装依赖。

1. yarn
2. yarn add react-native-track-player

### 调试步骤

1. yarn start
2. yarn android / ios
   1. 编译 提示 Successfully built the app，此时已经成功安装 app 到设备上
   2. 在 iPhone 上运行 app
   3. 在 VSCode 中编写代码， 会实时更新到设备上，类似 Vue/React 的开发体验

### 已知问题

1. 依赖 react-native-photo-gallery-api 在 android 上编译报错：

```
多个地方下面语句
// retriever.release();
改为
try {
    retriever.release();
} catch (IOException e) {
    // Do nothing. We can't handle this, and this is usually a system problem
}
```

### 升级 react-native

1. 修改 package.json 中
   "dependencies": {
   "react-native": "0.74.2",
   }
2. npm/yarn install
3. npx react-native upgrade 0.74.2

### 升级后发现无法 pod install 无法安装

Invalid `Podfile` file: 767: unexpected token at ''.

删除 node_modules 后重新 install
cd ios && pod install

### Xcode Error PhaseScriptExecution failed with a nonzero exit code

https://stackoverflow.com/questions/75975043/xcode-error-phasescriptexecution-failed-with-a-nonzero-exit-code

### iOS 编译报错提示

bundle exec pod install
https://tingyishih.medium.com/why-bundle-exec-whats-the-difference-ae7ba488a324

### XCode 上去掉警告

1. 在 XCode 的 schema 上设置为 release
2. 或使用 babel-plugin-transform-remove-console
