import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

// 读取程序数据目录
export const getAppDataPath = () => {
  return Platform.OS === 'ios'
    ? RNFS.LibraryDirectoryPath
    : RNFS.ExternalDirectoryPath;
};

// 读取程序数据目录下文件
export const readFile = (file: string) => {
  const path = getAppDataPath() + '/' + file;
  return readAbsFile(path);
};

// 读取绝对路径文件
export const readAbsFile = (file: string) => {
  return RNFS.readFile(file);
};
