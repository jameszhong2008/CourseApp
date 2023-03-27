import {Button, Text, View, StyleSheet, useColorScheme, TouchableOpacity} from 'react-native';
import AudioManager from '../common/article_oper';

import {useHookstate} from '@hookstate/core';
import {AudioState, uiState} from '../state/ui-state';
import AudioControl from './AudioControl';
import ArticleList from './ArticleList';
import {useState} from 'react';

export const getPlayBtnTitle = (state: AudioState) => {
  let title = '播放';
  if (state === 'playing') title = '停止';
  else if (state === 'pause') title = '继续';
  return title;
};

export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const state = useHookstate(uiState);
  const toogleAudio = () => {
    AudioManager.getInstance().toggleAudio();
  };

  const module = state.control.module.value
  const showList = () => {
    state.control.module.set(module !== 'base' ? 'base' : 'list');
  };
  const manuAudio = () => {
    state.control.module.set(module !== 'base' ? 'base' : 'audio');
  };
  return (
    <View style={styles.container}>
      {module == 'audio' && <AudioControl />}
      {module === 'list' && <ArticleList />}
      {module === 'base' && (
        <TouchableOpacity onPress={manuAudio}>
          <View style={styles.baseList}>
            <Text style={[styles.titleWidth, isDarkMode? styles.textLight: styles.textDark]}>{state.audio.title.value}</Text>
            <Button
              title={getPlayBtnTitle(state.audio.state.value)}
              onPress={toogleAudio}></Button>
            <Button title={'列表'} onPress={showList}></Button>
          </View>
        </TouchableOpacity>
      )}      
    </View>    
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleWidth: {
    width: '70%',
  },
  textDark: {
    color: '#000000',
  },
  textLight: {
    color: '#FFFFFF',
  },
  baseList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
