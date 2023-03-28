import {FileInfo} from '../pages/courses';
import {AudioState} from '../state/ui-state';
import {getSourceAudioUrl} from './doc_oper';
import {readAbsFile} from './file_oper';
import {uiState} from '../state/ui-state';
import {AudioPlayer, IAudioPlayerDelegate} from './audio_player';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadArticle = (
  article: FileInfo,
  index: number,
  onlyLoad: boolean = false,
  seek?: number,
) => {
  return new Promise((resolve, reject) => {
    readAbsFile(article.path)
      .then(result => {
        const {source, url} = getSourceAudioUrl(result);
        AudioManager.getInstance().playAudio(
          article.name,
          url,
          index,
          onlyLoad,
          seek,
        );
        console.log('play next', index, article.name);
        resolve({source, url});
      })
      .catch(err => {
        reject(err);
      });
  });
};

interface CourseInfo {
  name: string;
  path: string;
  articles: FileInfo[];
}

export default class AudioManager implements IAudioPlayerDelegate {
  title = '';
  url: string = '';
  _state: 'playing' | 'pause' | null = null;

  // 课程path
  course_name = '';
  course_path = '';
  articles: FileInfo[] = [];
  // 文章索引
  index: number = -1;

  audioPlayer: AudioPlayer;

  static instance: AudioManager;
  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  constructor() {
    this.audioPlayer = new AudioPlayer(this);
  }

  async onPlayerReady(): Promise<void> {
    const idxStr = await AsyncStorage.getItem('articleIdx');
    if (!idxStr) return;
    const idx = parseInt(idxStr);

    let seek = 0;
    const seekStr = await AsyncStorage.getItem('articleSeek');
    if (seekStr) {
      // 往前seek多播5秒
      seek = Math.max(0, parseInt(seekStr) - 5);
    }

    const courseStr = await AsyncStorage.getItem('course');
    if (!courseStr) return;
    try {
      const course = JSON.parse(courseStr) as CourseInfo;
      this.setCourse(course.name, course.path, course.articles);
      if (idx > -1 && idx < course.articles.length) {
        loadArticle(course.articles[idx], idx, true, seek);
      }
    } catch (err) {}
  }

  onFinishPlaying(): void {
    if (this.index < this.articles.length - 1) {
      let article = this.articles[this.index + 1];
      loadArticle(article, this.index + 1, false);
    } else {
      // 结束循环播放
      this.setState(null);
    }
  }

  onPositionUpdated(position: number): void {
    AsyncStorage.setItem('articleSeek', `${position}`, error => {
      error && console.log(error.toString());
    });
  }

  setState(state: AudioState) {
    this._state = state;
    uiState.audio.state.set(state);
  }

  setCourse(name: string, path: string, articles: FileInfo[]) {
    if (path === this.course_path) return;

    this.course_name = name;
    this.course_path = path;
    this.articles = articles;
    uiState.course.name.set(name);
    uiState.course.articles.set(articles);

    // 保存当前课程和文章列表
    AsyncStorage.setItem(
      'course',
      JSON.stringify({name, path, articles}),
      error => {
        error && console.log(error.toString());
      },
    );
  }

  playAudio(
    name: string,
    url: string,
    index: number,
    onlyLoad: boolean,
    seek?: number,
  ) {
    if (this.url === url) return;

    this.index = index;
    uiState.audio.merge({title: name, index});

    // 保存文章索引
    AsyncStorage.setItem('articleIdx', `${index}`, error => {
      error && console.log(error.toString());
    });

    if (!seek) {
      AsyncStorage.removeItem('articleSeek');
    }

    try {
      this.audioPlayer.playUrl(this.course_name, name, url, onlyLoad, seek);
      this.url = url;
      this.setState(onlyLoad ? 'pause' : 'playing');
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  }

  pauseAudio() {
    this.audioPlayer.pause();
    this.setState('pause');
  }

  toggleAudio() {
    if (this._state === 'playing') {
      this.pauseAudio();
    } else if (this._state === 'pause') {
      this.audioPlayer.resume();
      this.setState('playing');
    } else {
      return false;
    }
    return true;
  }

  seekAudio(second: number) {
    this.audioPlayer.seek(second);
  }

  async getDuration() {
    if (this._state === null) {
      return Promise.resolve(0);
    }
    return this.audioPlayer.getDuration();
  }

  async getPosition() {
    if (this._state === null) {
      return Promise.resolve(0);
    }
    return this.audioPlayer.getPosition();
  }
}
