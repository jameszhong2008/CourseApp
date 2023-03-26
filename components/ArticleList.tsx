import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
} from 'react-native';
import {uiState} from '../state/ui-state';
import {useHookstate} from '@hookstate/core';
import {loadArticle} from '../common/audio_oper';

export default () => {
  const state = useHookstate(uiState);
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.text}>{state.course.name.value}</Text>
      <ScrollView style={styles.scrollView}>
        {state.course.articles.value.map((v, index) => (
          <TouchableOpacity
            key={v.name}
            onPress={() => {
              loadArticle(v, index);
            }}>
            <Text style={styles.text}>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
  },
  scrollView: {
    height: '60%',
  },
});
