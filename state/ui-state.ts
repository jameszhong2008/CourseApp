import {hookstate} from '@hookstate/core';
import {FileInfo} from '../pages/courses';

export type AudioState = 'playing' | 'pause' | null;
export type ControlState = 'audio' | 'list' | 'base';
export const uiState = hookstate<{
  course: {name: string; articles: FileInfo[]};
  audio: {title: string; state: AudioState; index: number; rate: number};
  control: {module: ControlState};
  updateCourseProgress: string;
  updateArticleProgress: string;
}>({
  /**
   * 当前音频
   */
  audio: {title: '', state: null, index: -1, rate: 1},
  /**
   * 当前课程
   */
  course: {name: '', articles: []},
  /**
   * 控制条状态
   */
  control: {module: 'base'},
  /**
   * 更新课程和文章的进度显示
   */
  updateCourseProgress: '',
  /**
   * 更新课程和文章的进度显示
   */
  updateArticleProgress: '',
});
