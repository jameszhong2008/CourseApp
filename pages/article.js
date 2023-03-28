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
import AudioManager, { loadArticle } from '../common/article_oper';
import ArticleView from '../components/ArticleView';


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
  const {article, index} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  title = article.name;

  const [content, setContent] = useState('');
  useEffect(() => {
    loadArticle(article, index).then(result => {      
      if (result.url) {
        setTimeout(() => {
          AudioManager.getInstance().playAudio(article.name, result.url, index);
        });
      }
      setContent(result.source);
    })
    .catch(err => {
      setContent("");
    })
  }, [])  

   return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.black,
          },
        ]}>
        {title}
      </Text>      
      <ArticleView html={content} />
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