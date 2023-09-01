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
