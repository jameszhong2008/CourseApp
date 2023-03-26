import SoundPlayer from 'react-native-sound-player';
import {FileInfo} from '../pages/courses';
import {AudioState} from '../state/ui-state';
import {getSourceAudioUrl} from './doc_oper';
import {readAbsFile} from './file_oper';
import {uiState} from '../state/ui-state';

export const loadArticle = (article: FileInfo, index: number) => {
  return new Promise((resolve, reject) => {
    readAbsFile(article.path)
      .then(result => {
        const {source, url} = getSourceAudioUrl(result);
        AudioManager.getInstance().playAudio(article.name, url, index);
        console.log('play next', index + 1, article.name);
        resolve({source, url});
      })
      .catch(err => {
        reject(err);
      });
  });
};
export default class AudioManager {
  title = '';
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
    // iOS play sound under background and Mute Mode
    SoundPlayer.setSpeaker(false);
    SoundPlayer.addEventListener('FinishedPlaying', () => {
      if (this.index < this.articles.length - 1) {
        let article = this.articles[this.index + 1];
        loadArticle(article, this.index + 1);
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

  setCourse(name: string, articles: FileInfo[]) {
    this.articles = articles;
    uiState.course.name.set(name);
    uiState.course.articles.set(articles);
  }

  playAudio(name: string, url: string, index: number) {
    console.log('playAudio', index, url);
    this.index = index;
    uiState.audio.merge({title: name, index});

    if (this.url === url) return;
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

  toggleAudio() {
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

  seekAudio(second: number) {
    SoundPlayer.seek(second);
  }

  async getInfo() {
    if (this._state === null) {
      return Promise.resolve({currentTime: 0, duration: 0});
    }
    return SoundPlayer.getInfo();
  }
}
