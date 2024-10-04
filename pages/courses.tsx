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
import CourseItem from '../components/CourseItem';
import {ButtonGroup} from '../components/ButtonGroup';
import {useHookstate} from '@hookstate/core';
import {uiState} from '../state/ui-state';
import AudioManager from '../common/article_oper';

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
  const state = useHookstate(uiState);

  const readDir = () => {
    console.log('rootpath', getAppDataPath());
    RNFS.readDir(getAppDataPath())
      .then(async items => {
        items.sort(sortByTime);
        const manager = AudioManager.getInstance();
        const lst: FileInfo[] = [];
        for (let i = 0; i < items.length; i++) {
          let v = items[i];
          if (v.isDirectory()) {
            lst.push({...v, is_file: v.isFile()});
            const courseState = {
              name: v.name,
              progress: await manager.getCourseProgress(v.name),
            };
            state.courseState.merge([courseState]);
          }
        }
        setCourses(lst);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    readDir();
  }, []);

  const selectButton = (type: 'type' | 'state', v: string) => {
    state.filter[type].set(v);
  };

  const filterCourseType = (v: FileInfo) => {
    if (state.filter.type.get() === '全部') return true;
    else if (state.filter.type.get() === '管理') {
      return v.name.indexOf('管理') !== -1 || v.name.indexOf('领导力') !== -1;
    } else if (state.filter.type.get() === '其他') {
      return v.name.indexOf('管理') === -1 && v.name.indexOf('领导力') === -1;
    } else {
      return true;
    }
  };

  const filterCourseState = (v: FileInfo) => {
    if (state.filter.state.get() === '全部') {
      return true;
    } else {
      const progress =
        state.courseState.get().filter(v1 => v1.name === v.name)[0]?.progress ||
        0;
      if (state.filter.state.get() === '在学') {
        return progress > 0 && progress < 0.995;
      } else if (state.filter.state.get() === '学完') {
        return progress >= 0.995;
      } else if (state.filter.state.get() === '未学') {
        return progress === 0;
      }
      return true;
    }
  };

  const filterCourse = (v: FileInfo) => {
    return filterCourseType(v) && filterCourseState(v);
  };

  return (
    <View style={styles.sectionContainer}>
      <View>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: Colors.black,
            },
          ]}>
          {'课程'}
        </Text>
        <ButtonGroup
          buttons={['管理', '其他', '全部']}
          selectButton={v => selectButton('type', v)}
        />
        <ButtonGroup
          buttons={['在学', '学完', '未学', '全部']}
          selectButton={v => selectButton('state', v)}
        />
      </View>
      <ScrollView>
        {courses.filter(filterCourse).map(v => (
          <CourseItem
            key={v.name}
            course={v.name}
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
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 80,
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
