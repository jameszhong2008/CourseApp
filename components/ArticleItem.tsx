import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  useColorScheme,
  GestureResponderEvent,
} from 'react-native';
import {FileInfo} from '../pages/courses';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useHookstate} from '@hookstate/core';
import {uiState} from '../state/ui-state';
import AudioManager from '../common/article_oper';

export default ({
  course,
  article,
  onPress,
}: {
  course: string;
  article: FileInfo;
  onPress: (v: FileInfo) => void;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const state = useHookstate(uiState);

  const [progress, setProgress] = useState(0);
  const [needUpdate, setNeedUpdate] = useState(false);

  const updatePrgress = async () => {
    let progress = await AudioManager.getInstance().getProgress(
      course.trim(),
      article.name.trim(),
    );
    setProgress(progress * 100);
  };

  useEffect(() => {
    updatePrgress();
    const key = AudioManager.getInstance().getArticleKey(course, article.name);
    setNeedUpdate(state.updateArticleProgress.value === key);
  }, []);

  useEffect(() => {
    if (needUpdate) updatePrgress();
  }, [state.audio.position.value]);

  useEffect(() => {
    const key = AudioManager.getInstance().getArticleKey(course, article.name);
    setNeedUpdate(state.updateArticleProgress.value === key);
  }, [state.updateArticleProgress.value]);

  const progressColor =
    progress >= 99.5 ? 'rgba(169, 239, 169, .5)' : 'rgba(169, 169, 239, .5)';
  const lineHeight = 30;
  return (
    <TouchableOpacity
      onPress={() => onPress(article)}
      style={{paddingVertical: 2}}>
      <View
        style={{
          height: lineHeight,
        }}>
        <Text style={[styles.textDark, {lineHeight}]}>{article.name}</Text>
        <View
          style={[
            styles.progressBox,
            {
              top: 0,
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
  },
  textDark: {
    color: '#000000',
    fontSize: 16,
    lineHeight: 30,
  },
});
