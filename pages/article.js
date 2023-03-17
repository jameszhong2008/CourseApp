import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Button,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { WebView } from 'react-native-webview';
import { useCallback, useEffect, useState } from 'react';
import { readFile } from '../common/file_oper';
import SoundPlayer from 'react-native-sound-player'

const htmlHead = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  </head>
<body>`;
const htmlEnd = `</body>`;

export default ({title}) => {
  title = '01 _ 基础篇：学习此课程你需要了解哪些基础知识？';
  const isDarkMode = useColorScheme() === 'dark';

  const [content, setContent] = useState('');
  useEffect(() => {
    readFile(title + ".html")
    .then(result => {      
      setContent(htmlHead + result + htmlEnd);
    })
    .catch(err => {
      setContent("<p>打开文件失败<p/>");
    })
    
  }, [title])

  try {
    SoundPlayer.playUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  } catch (e) {
      console.log(`cannot play the sound file`, e)
  }

  const INJECTED_JAVASCRIPT = `(function(){

    function playAudio() {
      var audios = document.getElementsByTagName('audio');
      if (audios.length) {
        console.log(audios[0]);
        audios[0].play().then(result => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              name: audios[0].tagName,
              success: 'ok'
            }));
          } 
        }).catch(e => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              name: audios[0].tagName,
              error: e
            }));
          } 
        });
      }
    }

    setTimeout(playAudio, 2000);

   })();`;
   
   const btnName = 'Stop'
  
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>      
      <Button title={btnName} onPress={() => {
        SoundPlayer.stop();
      }}/>
      <WebView
        javaScriptEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        originWhitelist={['*']}
        source={{html: content}}
        style={{marginTop: 20}}
        onMessage={(event) => {
          console.log('onMessage===', event.nativeEvent.data);
          const data = event && event.nativeEvent && event.nativeEvent.data;
          if (data) {
            const message = JSON.parse(data);
            console.log(data)
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
    /** 必须将WebView 的父节点设置flex为1， 否则该页面闪退*/
    flex: 1
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },  
});