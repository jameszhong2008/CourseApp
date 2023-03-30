import {hookstate} from '@hookstate/core';
import {FileInfo} from '../pages/courses';

export type AudioState = 'playing' | 'pause' | null;
export type ControlState = 'audio' | 'list' | 'base';
export const uiState = hookstate<{
  course: {name: string; articles: FileInfo[]};
  audio: {title: string; state: AudioState; index: number; rate: number};
  control: {module: ControlState};
}>({
  audio: {title: '', state: null, index: -1, rate: 1},
  course: {name: '', articles: []},
  control: {module: 'base'},
});
