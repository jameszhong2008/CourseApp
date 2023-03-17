import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import RNFS from 'react-native-fs';

import Articles from './articles'
import {Platform} from 'react-native';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
export default (props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const courses = ['从0到1', 'AB测试']

  const readDir = () => {
    let rnfsPath = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath;    
    const path = rnfsPath;
    //write the file
    RNFS.readDir(path)
      .then((items) => {
        items.forEach(v => {
          console.log('files', v.name, v.isDirectory())
        })        
      })
      .catch((err) => {
        console.log(err)     
      })
  }

  readDir()

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
      {courses.map(v => (
        <TouchableOpacity key={v} onPress={()=>{
          props.navigation.navigate("Articles")
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