import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
export default (props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const articles = ['第一课', '第二课']
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {props.title}
      </Text>
      {articles.map(v => (
        <TouchableOpacity key={v} onPress={() => {
          props.navigation.navigate("Article")
        }}>
        <Text>
          {v}
        </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});