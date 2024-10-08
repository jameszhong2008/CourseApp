import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
  SafeAreaView,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import AudioManager, {loadArticle} from '../common/article_oper';
import ArticleView from '../components/ArticleView';

interface Article {
  name: string;
  // Add other properties of the article object here
}

interface RouteParams {
  article: Article;
  index: number;
}

interface ArticleProps {
  title?: string;
  route: {
    params: RouteParams;
  };
}

const Article: React.FC<ArticleProps> = ({title, route}) => {
  const {article, index} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  title = article.name;

  const [content, setContent] = useState<{
    content?: string;
    progressInfo?: {
      course: string;
      article: string;
      progress: number;
    };
  }>({});

  const course = AudioManager.getInstance().course_name;
  useEffect(() => {
    AudioManager.getInstance()
      .getProgress(course.trim(), article.name.trim())
      .then(progress => {
        loadArticle(article, index, false, {
          type: 'percent',
          value: progress,
        })
          .then(result => {
            setContent({
              content: result.source,
              progressInfo: {course, article: article.name, progress},
            });
          })
          .catch(err => {
            setContent({});
          });
      });

    return () => {
      // 记录进度
      AudioManager.getInstance().recordProgress();
    };
  }, [article, index]);

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
      <ArticleView html={content.content} progressInfo={content.progressInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
    /** 必须将WebView 的父节点设置flex为1， 否则该页面闪退*/
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default Article;
