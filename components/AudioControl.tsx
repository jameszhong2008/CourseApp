import {StyleSheet, Button, ScrollView, View, Text} from 'react-native';
import {uiState} from '../state/ui-state';
import {useHookstate} from '@hookstate/core';
import AudioManager, {loadArticle} from '../common/audio_oper';
import {getPlayBtnTitle} from './control';
import Slider from '@react-native-community/slider';
import {useEffect, useState} from 'react';

const secToTime = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes < 10 ? '0' + minutes : minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`;
};

export default () => {
  const state = useHookstate(uiState);
  const [info, setInfo] = useState<{currentTime: number; duration: number}>({
    currentTime: 0,
    duration: 0,
  });
  const prevArticle = () => {
    let current = state.audio.index.value;
    let index = current - 1;
    if (index > -1) {
      loadArticle(state.course.articles.value[index], index);
    }
  };
  const nextArticle = () => {
    let current = state.audio.index.value;
    let index = current + 1;
    if (index < state.course.articles.value.length) {
      loadArticle(state.course.articles.value[index], index);
    }
  };

  const toggleAudio = () => {
    AudioManager.getInstance().toggleAudio();
  };

  const onValueChange = (value: number) => {
    AudioManager.getInstance().seekAudio(value);
  };
  const onSlidingComplete = (value: number) => {
    AudioManager.getInstance().seekAudio(value);
  };

  useEffect(() => {
    let timer = setInterval(async () => {
      const info = await AudioManager.getInstance().getInfo();
      setInfo(info);
      console.log('info', info);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.text}>{state.audio.title.value}</Text>
      <View>
        <View>
          <Slider
            value={info.currentTime}
            maximumValue={info.duration || 1}
            onValueChange={onValueChange}
            onSlidingComplete={onSlidingComplete}
          />
          <View style={styles.horizonFlex}>
            <Text style={styles.text}>{secToTime(info.currentTime)}</Text>
            <Text style={styles.text}>{secToTime(info.duration)}</Text>
          </View>
        </View>
        <View style={styles.horizonFlex}>
          <Button title={'上一个'} onPress={prevArticle}></Button>
          <Button
            title={getPlayBtnTitle(state.audio.state.value)}
            onPress={toggleAudio}></Button>
          <Button title={'下一个'} onPress={nextArticle}></Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  horizonFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: '#FFFFFF',
  },
});
