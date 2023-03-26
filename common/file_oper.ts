import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {FileInfo} from '../pages/courses';

// 读取程序数据目录
export const getAppDataPath = () => {
  return Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
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

export const sortByTime = (v1: FileInfo, v2: FileInfo) => {
  return (
    (v1.mtime ? v1.mtime.getTime() : 0) - (v2.mtime ? v2.mtime.getTime() : 0)
  );
};

export const sortByName = (v1: FileInfo, v2: FileInfo) => {
  return v1.name.localeCompare(v2.name);
};
