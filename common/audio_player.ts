import TrackPlayer, {
  Event,
  Capability,
  PlaybackProgressUpdatedEvent,
  RepeatMode,
  PlaybackStateEvent,
  State,
  RemoteJumpForwardEvent,
  RemoteJumpBackwardEvent,
  RemoteSeekEvent,
} from 'react-native-track-player';
import {PlaybackService} from './playback_service';

export interface IAudioPlayerDelegate {
  onPlayerReady(): void;
  onFinishPlaying(): void;
  onPositionUpdated(position: number): void;
  onPlayerStateChange(e: PlaybackStateEvent): void;
  onRemotePrev(): void;
  onRemoteNext(): void;
  onRemoteSeek(e: RemoteSeekEvent): void;
}

export class AudioPlayer {
  disableFinish = false;
  constructor(delegate: IAudioPlayerDelegate) {
    // background模式时也可以继续工作
    TrackPlayer.registerPlaybackService(() => PlaybackService);
    // 设置Player
    TrackPlayer.setupPlayer()
      .then(_ => {
        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
          if (this.disableFinish) return;
          delegate.onFinishPlaying();
        });
        TrackPlayer.addEventListener(
          Event.PlaybackProgressUpdated,
          (e: PlaybackProgressUpdatedEvent) => {
            delegate.onPositionUpdated(e.position);
          },
        );
        TrackPlayer.addEventListener(
          Event.PlaybackState,
          (e: PlaybackStateEvent) => {
            delegate.onPlayerStateChange(e);
          },
        );
        TrackPlayer.addEventListener(Event.RemotePrevious, () => {
          delegate.onRemotePrev();
        });
        TrackPlayer.addEventListener(Event.RemoteNext, () => {
          delegate.onRemoteNext();
        });
        TrackPlayer.addEventListener(Event.RemoteSeek, (e: RemoteSeekEvent) => {
          delegate.onRemoteSeek(e);
        });
        delegate.onPlayerReady();
      })
      .catch(e => {
        console.log('TrackPlayer.setupPlayer error:', e);
      });

    TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
      ],

      // 更新事件间隔 2秒
      progressUpdateEventInterval: 1,

      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
    TrackPlayer.setRepeatMode(RepeatMode.Off);
  }

  getReady() {
    return new Promise(resolve => {
      TrackPlayer.getState().then(state => {
        if (state === State.Ready) {
          resolve(true);
        } else {
          setTimeout(() => {
            this.getReady().then(resolve);
          }, 100);
        }
      });
    });
  }

  async playUrl(
    artist: string,
    title: string,
    url: string,
    onlyLoad: boolean,
    artwork: string | {url: string},
    seek?: {type: 'position' | 'percent'; value: number},
  ) {
    // SoundPlayer.playUrl(url);
    this.disableFinish = true;
    await TrackPlayer.pause();
    await TrackPlayer.reset();

    if (typeof artwork === 'object') {
      artwork = 'file://' + artwork.url;
    }
    await TrackPlayer.add({
      url,
      title,
      artist,
      artwork,
    });
    if (seek) {
      await this.getReady();
      const du = await this.getDuration();
      const position = seek.type === 'position' ? seek.value : du * seek.value;
      await TrackPlayer.seekTo(Math.max(0, position - 5));
    }
    if (!onlyLoad) {
      await TrackPlayer.play();
    }

    // 确保音频已打开， 获取下长度
    // 这时候获取不到长度， 需等到状态为 connecting 之后才行
    const duration = await this.getDuration();
    // if (duration <= 0) return;

    // 完成播放自动切换下条音频
    this.disableFinish = false;
  }

  pause() {
    // SoundPlayer.pause();
    TrackPlayer.pause();
  }

  resume() {
    // SoundPlayer.resume();
    TrackPlayer.play();
  }

  seek(second: number) {
    // SoundPlayer.seek(second);
    TrackPlayer.seekTo(second);
  }

  async getDuration() {
    const du = await TrackPlayer.getDuration();
    return du;
  }

  async getPosition() {
    return TrackPlayer.getPosition();
  }

  async setRate(rate: number) {
    // SoundPlayer.setRate(rate);
    return TrackPlayer.setRate(rate);
  }
}
