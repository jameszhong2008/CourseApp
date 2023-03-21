import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { WebView } from 'react-native-webview';
import { useCallback, useEffect, useState } from 'react';
import { readAbsFile, readFile } from '../common/file_oper';
import AudioManager from '../common/audio_oper';
import { getAudioUrl, getSourceAudioUrl } from '../common/doc_oper';

// 禁止页面缩放
// <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
const htmlHead = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
<body>`;
const htmlEnd = `</body>`;

export default ({title, route}) => {
  // 带入文章列表和当前序号
  const {name, path, index} = route.params.article;
  const isDarkMode = useColorScheme() === 'dark';
  title = name;

  const [content, setContent] = useState('');
  useEffect(() => {
    readAbsFile(path)
    .then(result => {      
      const {source, url } = getSourceAudioUrl(result);
      if (url) {
        setTimeout(() => {
          AudioManager.getInstance().playAudio(url, index);
        });
      }
      setContent(htmlHead + source + htmlEnd);
    })
    .catch(err => {
      setContent("<p>打开文件失败<p/>");
    })
  }, [])  

  const INJECTED_JAVASCRIPT = `(function(){

    function playAudio() {
      var audios = document.getElementsByTagName('audio');
      if (audios.length) {
        console.log(audios[0]);
        /* audios[0].play().then(result => {
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
        }); */
      }
    }

    setTimeout(playAudio, 2000);

   })();`;
   
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
      <WebView
        javaScriptEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        originWhitelist={['*']}
        scalesPageToFit={true}
        showsVerticalScrollIndicator={false}
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