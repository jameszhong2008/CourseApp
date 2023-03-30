import {StyleSheet, useColorScheme, View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import {useCallback, useEffect, useState} from 'react';

// 禁止页面缩放
// <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
const htmlHead = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <style>
    p img {
      width: 100%;
      height: auto;
    }
  </style>
<body>`;
const htmlEnd = `</body>`;

export default (props: {html: string}) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    if (props.html) setContent(htmlHead + props.html + htmlEnd);
    else setContent('<p>打开文件失败<p/>');
  }, [props.html]);

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
      <WebView
        javaScriptEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        originWhitelist={['*']}
        scalesPageToFit={true}
        showsVerticalScrollIndicator={false}
        source={{html: content}}
        style={{marginTop: 20}}
        onMessage={event => {
          /* console.log('onMessage===', event.nativeEvent.data);
          const data = event && event.nativeEvent && event.nativeEvent.data;
          if (data) {
            const message = JSON.parse(data);
            console.log(data)
          } */
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    /** 必须将WebView 的父节点设置flex为1， 否则该页面闪退*/
    flex: 1,
  },
});
