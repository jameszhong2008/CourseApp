export const getSourceAudioUrl = (source: string) => {
  let url = '';
  let removeAudio = /<audio.*src=".+.mp3".+?><\/audio>/.exec(source);
  if (removeAudio) {
    const audioSrcReg = /src=".*mp3"/;
    const findAudio = audioSrcReg.exec(source);
    if (findAudio) {
      let findStr = findAudio[0];
      url = findStr.substring(5, findStr.length - 1);
      // 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      // 删除html页面audio
      // source = source
    }
  }
  return {source, url};
};
