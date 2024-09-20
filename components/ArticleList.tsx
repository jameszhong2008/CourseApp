import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  useColorScheme,
} from 'react-native';
import {uiState} from '../state/ui-state';
import {useHookstate} from '@hookstate/core';
import AudioManager, {loadArticle} from '../common/article_oper';
import ArticleScrollView from './ArticleScrollView';

export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const state = useHookstate(uiState);
  const minimumControl = () => {
    state.control.module.set('base');
  };
  const articles = state.course.articles.value.map(v => {
    return {
      ctime: v.ctime,
      mtime: v.mtime,
      name: v.name,
      path: v.path,
      size: v.size,
      is_file: v.is_file,
    };
  });
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.textHead, styles.textDark]}>
        {state.course.name.value || '课程为空'}
      </Text>
      <ArticleScrollView
        course={state.course.name.value}
        articles={articles}
        onPress={async (v, index) => {
          let progress = await AudioManager.getInstance().getProgress(
            state.course.name.trim(),
            v.name.trim(),
          );
          loadArticle(v, index, false, {type: 'percent', value: progress});
        }}
      />
      <TouchableOpacity
        onPress={() => {
          minimumControl();
        }}
        style={styles.closeBtn}>
        <Text style={[{fontSize: 18}, styles.textDark]}>关闭</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 4,
    paddingTop: 40,
    height: '100%',
  },
  textHead: {
    fontSize: 24,
    paddingVertical: 8,
    fontWeight: '600',
  },
  textDark: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeBtn: {
    paddingHorizontal: 4,
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
});
