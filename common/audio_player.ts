// import SoundPlayer from 'react-native-sound-player';
import TrackPlayer, {
  Event,
  Capability,
  PlaybackProgressUpdatedEvent,
} from 'react-native-track-player';
import {PlaybackService} from './playback_service';

export interface IAudioPlayerDelegate {
  onPlayerReady(): void;
  onFinishPlaying(): void;
  onPositionUpdated(position: number): void;
}

export class AudioPlayer {
  disableFinish = false;
  constructor(delegate: IAudioPlayerDelegate) {
    // iOS play sound under background and Mute Mode
    /*
    SoundPlayer.setSpeaker(false);
    SoundPlayer.addEventListener('FinishedPlaying', () => {
      delegate.onFinishPlaying();
    }); */
    // background模式时也可以继续工作
    TrackPlayer.registerPlaybackService(() => PlaybackService);
    // 设置Player
    TrackPlayer.setupPlayer().then(_ => {
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
      delegate.onPlayerReady();
    });

    TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],

      // 更新事件间隔 2秒
      progressUpdateEventInterval: 2,

      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
  }

  async playUrl(
    artist: string,
    title: string,
    url: string,
    onlyLoad: boolean,
    artwork: string | {url: string},
    seek?: number,
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
      await TrackPlayer.seekTo(seek);
    }
    if (!onlyLoad) {
      await TrackPlayer.play();
    }
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
    // return (await SoundPlayer.getInfo()).duration;
    return TrackPlayer.getDuration();
  }

  async getPosition() {
    // return (await SoundPlayer.getInfo()).currentTime;
    return TrackPlayer.getPosition();
  }

  async setRate(rate: number) {
    // SoundPlayer.setRate(rate);
    return TrackPlayer.setRate(rate);
  }
}
