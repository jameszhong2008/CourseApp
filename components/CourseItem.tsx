import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  useColorScheme,
  GestureResponderEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useHookstate} from '@hookstate/core';
import {uiState} from '../state/ui-state';

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
  }, [state.updateCourseProgress]);

  useEffect(() => {
    updatePrgress();
  }, []);

  return (
    <TouchableOpacity onPress={() => onPress()} style={{paddingVertical: 2}}>
      <View>
        <View style={[styles.progressBox, {width: `${progress}%`}]} />
        <Text style={[styles.textDark]}>{course}</Text>
      </View>
    </TouchableOpacity>
  );
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
