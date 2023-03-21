import SoundPlayer from 'react-native-sound-player';
import {FileInfo} from '../pages/courses';
import {AudioState} from '../state/ui-state';
import {getSourceAudioUrl} from './doc_oper';
import {readAbsFile} from './file_oper';
import {uiState} from '../state/ui-state';

export default class AudioManager {
  url: string = '';
  _state: 'playing' | 'pause' | null = null;
  articles: FileInfo[] = [];
  index: number = -1;

  static instance: AudioManager;
  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  constructor() {
    SoundPlayer.addEventListener('FinishedPlaying', () => {
      if (this.index < this.articles.length - 1) {
        let arcicle = this.articles[this.index + 1];
        readAbsFile(arcicle.path).then(result => {
          const {url} = getSourceAudioUrl(result);
          this.playAudio(url, this.index + 1);
          console.log('play next', this.index, arcicle.name);
        });
      } else {
        // 结束循环播放
        this.setState(null);
      }
    });
  }

  setState(state: AudioState) {
    this._state = state;
    uiState.audio.state.set(state);
  }

  setArticles(articles: FileInfo[]) {
    this.articles = articles;
  }

  playAudio(url: string, index: number) {
    this.index = index;

    try {
      SoundPlayer.playUrl(url);
      this.url = url;
      this.setState('playing');
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  }

  pauseAudio() {
    SoundPlayer.pause();
    this.setState('pause');
  }

  toogleAudio() {
    if (this._state === 'playing') {
      this.pauseAudio();
    } else if (this._state === 'pause') {
      SoundPlayer.resume();
      this.setState('playing');
    } else {
      return false;
    }
    return true;
  }
}
