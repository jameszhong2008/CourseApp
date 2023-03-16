import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

export const readFile = (file: String) => {
  let rnfsPath =
    Platform.OS === 'ios'
      ? RNFS.LibraryDirectoryPath
      : RNFS.ExternalDirectoryPath;
  const path = rnfsPath + '/' + file;
  //read the file
  return RNFS.readFile(path);
};
