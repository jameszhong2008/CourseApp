import {FileInfo} from '../pages/courses';
import {AudioState} from '../state/ui-state';
import {getSourceAudioUrl} from './doc_oper';
import {readAbsFile} from './file_oper';
import {uiState} from '../state/ui-state';
import {AudioPlayer, IAudioPlayerDelegate} from './audio_player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AlbumOper} from './album_oper';
import {Platform} from 'react-native';
import {PlaybackStateEvent, State} from 'react-native-track-player';

export const loadArticle = (
  article: FileInfo,
  index: number,
  onlyLoad: boolean = false,
  seek?: {type: 'position' | 'percent'; value: number},
) => {
  return new Promise((resolve, reject) => {
    readAbsFile(article.path)
      .then(async result => {
        // 记录进度
        await AudioManager.getInstance().recordProgress();

        const {source, url} = getSourceAudioUrl(result);
        AudioManager.getInstance().playAudio(
          article.name,
          article.path,
          url,
          index,
          onlyLoad,
          seek,
        );
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
  path = '';
  url: string = '';
  _state: 'playing' | 'pause' | null = null;

  // 课程path
  course_name = '';
  course_path = '';
  articles: FileInfo[] = [];
  // 记录当前音频所属课程
  pre_course = {
    name: '',
    path: '',
    articles: [] as FileInfo[],
  };
  // 文章索引
  index: number = -1;
  // '../album0.jpg'
  photoCount = 0;
  artwork: string | {url: string} = '';

  audioPlayer: AudioPlayer;

  static instance: AudioManager;
  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  constructor() {
    // if (Platform.OS === 'ios') {
    //   try {
    //     this.artwork = require('../album0.jpg');
    //   } catch {}
    // }
    this.audioPlayer = new AudioPlayer(this);
  }

  /**
   * 读入当前的课程和文章
   * @returns
   */
  async onPlayerReady(): Promise<void> {
    this.photoCount = await AlbumOper.getCourseAlbumCount();

    const rateStr = await AsyncStorage.getItem('rate');
    if (rateStr) {
      this.setRate(parseFloat(rateStr));
    }
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
        loadArticle(course.articles[idx], idx, true, {
          type: 'position',
          value: seek,
        });
      }
    } catch (err) {}
  }

  async onFinishPlaying() {
    // 记录进度
    await this.recordProgress();

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
      uiState.audio.position.set(position);
    });
  }

  async onPlayerStateChange(e: PlaybackStateEvent) {
    this.setState(e.state === State.Playing ? 'playing' : 'pause');

    if (e.state === State.Ready) {
      const du = await this.audioPlayer.getDuration();
      uiState.audio.duration.set(du);
    }
  }

  setState(state: AudioState) {
    this._state = state;
    uiState.audio.state.set(state);
  }

  setCourse(name: string, path: string, articles: FileInfo[]) {
    if (path === this.course_path) return;

    // 记录当前音频所属课程
    this.pre_course = {
      name: this.course_name || name,
      path: this.course_path || path,
      articles: this.course_name ? this.articles : articles,
    };

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

  /**
   *
   * @param course
   * @param article
   * @returns
   */
  async getProgress(course: string, article: string) {
    const key = `article_prog_${course.trim()}_${article.trim()}`;
    const val = await AsyncStorage.getItem(key);
    let progress = 0;
    if (typeof val === 'string' && val) {
      progress = parseFloat(val);
    }
    return progress;
  }

  /**
   * 记录课程和文章播放进度
   */
  async recordProgress() {
    await this.recordArticleProgress();
    await this.recordCourseProgress();
  }

  /**
   * 保存当前文章听到的位置
   * @returns
   */
  async recordArticleProgress() {
    if (!this.pre_course.name || !this.title) return;

    const duration = await this.getDuration();
    const position = await this.getPosition();

    const progress = `${(position / (duration || 1)).toFixed(3)}`;
    this.setProgress(this.pre_course.name, this.title, progress, true);
  }

  async setProgress(
    course: string,
    article: string,
    progress: string,
    checkFinish: boolean,
  ) {
    const key = `article_prog_${course.trim()}_${article.trim()}`;
    const value = await AsyncStorage.getItem(key);
    if (checkFinish && typeof value === 'string' && parseFloat(value) > 0.999) {
      // 已经听完， 不再记录
      return;
    }

    AsyncStorage.setItem(key, progress, error => {
      error && console.log(error.toString());
    });

    // 更新当前文章界面
    uiState.updateArticleProgress.set(key);
  }

  /**
   * 保存当前课程听到的位置
   * @returns
   */
  async recordCourseProgress() {
    if (!this.pre_course.name) return;

    const key = `course_prog_${this.pre_course.name.trim()}`;

    const value = await AsyncStorage.getItem(key);
    if (typeof value === 'string' && parseFloat(value) > 0.995) {
      // 已经听完， 不再记录
      return;
    }

    let finish = 0;
    for (const v of this.pre_course.articles) {
      const keyA = `article_prog_${this.pre_course.name.trim()}_${v.name.trim()}`;
      const val = await AsyncStorage.getItem(keyA);
      if (typeof value === 'string' && val) {
        finish += parseFloat(val);
      }
    }

    const progress = `${(
      finish / (this.pre_course.articles.length || 1)
    ).toFixed(3)}`;
    AsyncStorage.setItem(key, progress, error => {
      error && console.log(error.toString());
    });
    // 更新界面
    uiState.updateArticleProgress.set(key);
  }

  /**
   *
   * @param title 文章名称
   * @param path 文章地址
   * @param url 音频地址
   * @param index 文章在课程中序号
   * @param onlyLoad 仅加载，不播放
   * @param seek 设置音频位置
   * @returns
   */
  async playAudio(
    title: string,
    path: string,
    url: string,
    index: number,
    onlyLoad: boolean,
    seek?: {type: 'position' | 'percent'; value: number},
  ) {
    if (this.url === url) return;

    this.title = title;
    this.path = path;
    this.index = index;
    uiState.audio.merge({title, index});

    // 保存文章索引
    AsyncStorage.setItem('articleIdx', `${index}`, error => {
      error && console.log(error.toString());
    });

    if (!seek) {
      AsyncStorage.removeItem('articleSeek');
    }

    if (this.photoCount) {
      const photo = await AlbumOper.getPhotoOfAlbum(
        'CourseApp',
        Math.round(Math.random() * this.photoCount),
        this.photoCount,
      );
      if (photo) {
        this.artwork = {url: photo};
      }
    }

    try {
      this.audioPlayer.playUrl(
        this.course_name,
        title,
        url,
        onlyLoad,
        this.artwork,
        seek,
      );
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

  setRate(rate: number) {
    this.audioPlayer.setRate(rate);

    uiState.audio.rate.set(rate);

    AsyncStorage.setItem('rate', `${rate}`, error => {
      error && console.log(error.toString());
    });
  }
}
