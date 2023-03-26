import {Button, Text, View, StyleSheet} from 'react-native';
import AudioManager from '../common/audio_oper';

import {useHookstate} from '@hookstate/core';
import {AudioState, uiState} from '../state/ui-state';
import AudioControl from './AudioControl';
import ArticleList from './ArticleList';
import {useState} from 'react';

export const getPlayBtnTitle = (state: AudioState) => {
  let title = 'Play';
  if (state === 'playing') title = 'Stop';
  else if (state === 'pause') title = 'Resume';
  return title;
};

export default () => {
  const state = useHookstate(uiState);
  const [showModule, setShowModule] = useState<'audio' | 'list' | 'base'>(
    'base',
  );
  const toogleAudio = () => {
    AudioManager.getInstance().toggleAudio();
  };

  const showList = () => {
    setShowModule(showModule !== 'list' ? 'list' : 'base');
  };
  const manuAudio = () => {
    setShowModule(showModule !== 'audio' ? 'audio' : 'base');
  };
  return (
    <View>
      {showModule == 'audio' && <AudioControl />}
      {showModule === 'list' && <ArticleList />}
      {showModule === 'base' && (
        <View style={styles.baseList}>
          <Text style={styles.title}>{state.audio.title.value}</Text>
          <Button
            title={getPlayBtnTitle(state.audio.state.value)}
            onPress={toogleAudio}></Button>
          <Button title={'列表'} onPress={showList}></Button>
        </View>
      )}
      <Button title={'音频'} onPress={manuAudio}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#FFFFFF',
    width: '70%',
  },
  baseList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
