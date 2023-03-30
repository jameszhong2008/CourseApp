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
import {loadArticle} from '../common/article_oper';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const state = useHookstate(uiState);
  const minimumControl = () => {
    state.control.module.set('base');
  };
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.textHead, styles.textDark]}>
        {state.course.name.value || '课程为空'}
      </Text>
      <ScrollView>
        {state.course.articles.value.map((v, index) => (
          <TouchableOpacity
            key={v.name}
            onPress={() => {
              loadArticle(v, index);
            }}
            style={{paddingVertical: 2}}>
            <Text style={[styles.textDark]}>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    marginTop: 8,
    paddingHorizontal: 4,
    height: '98%',
  },
  textHead: {
    fontSize: 24,
    paddingVertical: 8,
    fontWeight: '600',
  },
  textDark: {
    color: '#000000',
  },
  closeBtn: {
    paddingHorizontal: 4,
    position: 'absolute',
    bottom: 20,
    right: 0,
  },
});
