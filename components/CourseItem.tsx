import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useHookstate} from '@hookstate/core';
import {uiState} from '../state/ui-state';
import AudioManager from '../common/article_oper';

export default ({course, onPress}: {course: string; onPress: () => void}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const state = useHookstate(uiState);

  const [progress, setProgress] = useState(0);

  const updatePrgress = () => {
    let progress = 0;
    const key = `course_prog_${course.trim()}`;
    AsyncStorage.getItem(key).then(val => {
      if (typeof val === 'string' && val) {
        progress = parseFloat(val) * 100;
      }
      setProgress(progress);
    });
  };

  useEffect(() => {
    updatePrgress();
  }, []);

  useEffect(() => {
    const key = `course_prog_${course.trim()}`;
    if (state.updateCourseProgress.value !== key) return;
    updatePrgress();
    state.updateCourseProgress.set('');
  }, [state.updateCourseProgress.value]);

  useEffect(() => {
    updatePrgress();
  }, []);

  const progressColor =
    progress >= 99.5 ? 'rgba(169, 239, 169, .5)' : 'rgba(169, 169, 239, .5)';
  const lineHeight = 30;
  return (
    <TouchableOpacity onPress={() => onPress()} style={{paddingVertical: 2}}>
      <View
        style={{
          height: lineHeight,
        }}>
        <Text style={[styles.textDark, {lineHeight}]}>{course}</Text>
        <View
          style={[
            styles.progressBox,
            {
              width: `${progress}%`,
              backgroundColor: `${progressColor}`,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  progressBox: {
    position: 'absolute',
    height: '100%',
    top: 0,
  },
  textDark: {
    color: '#000000',
    fontSize: 16,
  },
});
