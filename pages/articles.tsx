import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {StyleSheet, useColorScheme, ScrollView, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FileInfo} from './courses';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import AudioManager from '../common/audio_oper';
import {sortByTime} from '../common/file_oper';

export default (props: {
  title: string;
  navigation: StackNavigationProp<any, any>;
  route: any;
}) => {
  const {name, path} = props.route.params.course;
  const isDarkMode = useColorScheme() === 'dark';
  const [articles, setArticles] = useState<FileInfo[]>([]);

  const readDir = () => {
    RNFS.readDir(path)
      .then(items => {
        /* if (name === '技术领导力实战笔记') items.sort(sortByTime);
        else  */ items.sort(sortByTime);

        const lst: FileInfo[] = [];
        items.forEach(v => {
          if (v.isFile()) {
            lst.push(v);
          }
        });
        // console.log('articles', lst);
        setArticles(lst);
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
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {name}
      </Text>
      <ScrollView>
        {articles.map((v, index) => (
          <TouchableOpacity
            key={v.name}
            onPress={() => {
              AudioManager.getInstance().setCourse(name, articles);
              props.navigation.navigate('Article', {
                index,
                article: {
                  name: v.name,
                  path: v.path,
                  /* ctime: v.ctime, mtime: v.mtime, */ size: v.size,
                },
              });
            }}>
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
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
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
