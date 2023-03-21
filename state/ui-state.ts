import {hookstate} from '@hookstate/core';

export type AudioState = 'playing' | 'pause' | null;
export const uiState = hookstate<{audio: {state: AudioState}}>({
  audio: {state: null},
});
