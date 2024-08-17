### 
使用 geek_crawler 项目下载 geek时间 课程，保存在应用存储中， 即可下载读取， 包含音频。
课程资料，仅供学习研究

### 使用 node 18

### 安装依赖。

1. yarn
2. yarn add react-native-track-player

### 调试步骤

1. yarn start
2. yarn android / ios

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
