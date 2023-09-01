import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  useColorScheme,
  GestureResponderEvent,
} from 'react-native';
import { FileInfo } from '../pages/courses';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default ({course, article, onPress}: {course:string, article: FileInfo, onPress: (v: FileInfo) => void} ) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    const key = `article_prog_${course.trim()}_${article.name.trim()}`;
    AsyncStorage.getItem(key).then((val) => {
      if (typeof val === 'string' && val) {
        progress = parseFloat(val) * 100;
      }
      setProgress(progress)
    });
  }, []);

  return <TouchableOpacity    
    onPress={() => onPress(article)}
    style={{paddingVertical: 2}}>
      <View>
        <View style={[styles.progressBox, {width: `${progress}%`}]}/>
        <Text style={[styles.textDark]}>{article.name}</Text>
    </View>
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  progressBox: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(169, 169, 239, .5)',
  },
  textDark: {
    color: '#000000',
  },  
});
