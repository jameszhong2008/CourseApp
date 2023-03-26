import {hookstate} from '@hookstate/core';
import {FileInfo} from '../pages/courses';

export type AudioState = 'playing' | 'pause' | null;
export const uiState = hookstate<{
  course: {name: string; articles: FileInfo[]};
  audio: {title: string; state: AudioState; index: number};
}>({
  audio: {title: '', state: null, index: -1},
  course: {name: '', articles: []},
});
