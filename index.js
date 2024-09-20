/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// 关闭全部yellow警告
/* LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Possible unhandled promise rejection (id:0: Network request failed)',
  'VirtualizedList: You have a large list that is slow to update',
]); */

AppRegistry.registerComponent(appName, () => App);
