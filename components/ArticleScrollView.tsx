import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  useColorScheme,
  GestureResponderEvent,
} from 'react-native';
import { FileInfo } from '../pages/courses';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import ArticleItem from './ArticleItem';

export default ({course, articles, onPress}: {course:string, articles: FileInfo[], onPress: (v: FileInfo, index: number) => void} ) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ScrollView>
      {articles.map((v, index) => (
        <ArticleItem
          key={v.name}
          course={course}
          article={v}
          onPress={() => onPress(v, index)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textDark: {
    color: '#000000',
  },
  closeBtn: {
    paddingHorizontal: 4,
    position: 'absolute',
    bottom: 20,
    right: 0,
  },
});
