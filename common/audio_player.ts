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

  async playUrl(url: string, seek?: number) {
    // SoundPlayer.playUrl(url);
    await TrackPlayer.pause();
    await TrackPlayer.reset();
    await TrackPlayer.add({
      url,
      title: 'Track Title',
      artist: 'Track Artist',
    });
    if (seek) {
      await TrackPlayer.seekTo(seek);
    }
    await TrackPlayer.play();
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
}
