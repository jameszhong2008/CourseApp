### 使用 node 18

### 安装依赖

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
