import {
  StyleSheet,
  useColorScheme,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import RNFS from 'react-native-fs';

import Articles from './articles';
import {Platform} from 'react-native';
import {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {getAppDataPath, sortByTime} from '../common/file_oper';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

export type FileInfo = {
  ctime: Date | undefined; // The creation date of the file (iOS only)
  mtime: Date | undefined; // The last modified date of the file
  name: string; // The name of the item
  path: string; // The absolute path to the item
  size: number; // Size in bytes
  is_file?: boolean;
};

export default (props: {
  title: string;
  navigation: StackNavigationProp<any, any>;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [courses, setCourses] = useState<FileInfo[]>([]);

  const readDir = () => {
    console.log('rootpath', getAppDataPath());
    RNFS.readDir(getAppDataPath())
      .then(items => {
        items.sort(sortByTime);
        const lst: FileInfo[] = [];
        items.forEach(v => {
          if (v.isDirectory()) {
            lst.push({...v, is_file: v.isFile()});
          }
        });
        setCourses(lst);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    readDir();
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.black,
          },
        ]}>
        {'全部课程'}
      </Text>
      <ScrollView>
        {courses.map(v => (
          <TouchableOpacity
            key={v.name}
            onPress={() => {
              if (v.is_file) {
                props.navigation.navigate('Article', {
                  article: {
                    index: 0,
                    name: v.name,
                    path: v.path,
                    /* ctime: v.ctime, mtime: v.mtime, */ size: v.size,
                  },
                });
              } else {
                props.navigation.navigate('Articles', {
                  course: {
                    name: v.name,
                    path: v.path,
                    /* ctime: v.ctime, mtime: v.mtime, */ size: v.size,
                  },
                });
              }
            }}
            style={{paddingVertical: 2}}>
            <Text>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 45,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 8,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
