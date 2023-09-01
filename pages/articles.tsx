import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useState} from 'react';
import {StyleSheet, useColorScheme, ScrollView, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FileInfo} from './courses';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import AudioManager from '../common/article_oper';
import {sortByTime} from '../common/file_oper';
import ArticleScrollView from '../components/ArticleScrollView';

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
            color: Colors.black,
          },
        ]}>
        {name}
      </Text>
      <ArticleScrollView course={name} articles={articles} onPress={(v, index) => {
        AudioManager.getInstance().setCourse(name, path, articles);
        props.navigation.navigate('Article', {
          index,
          article: {
            name: v.name,
            path: v.path,
            /* ctime: v.ctime, mtime: v.mtime, */ size: v.size,
          },
        });
      }}/>
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
