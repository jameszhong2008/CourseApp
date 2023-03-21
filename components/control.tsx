import {
  Button,
} from 'react-native';
import AudioManager from '../common/audio_oper';

import { useHookstate} from '@hookstate/core';
import { uiState } from '../state/ui-state';

export default () => {
  const state = useHookstate(uiState);
  const toogleAudio = () => {
    AudioManager.getInstance().toogleAudio()
  }
  const getButtonTitle = () => {
    let title = 'Play';
    if (state.audio.state.value === 'playing') title = 'Stop'
    else if (state.audio.state.value === 'pause') title = 'Resume'
    return title    
  }
  return <Button title={getButtonTitle()} onPress={toogleAudio}></Button>
}
