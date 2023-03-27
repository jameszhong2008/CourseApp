/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AudioManager from './common/article_oper';
import Control from './components/control';
import Nav from './route';

function App(): JSX.Element {
  // 先初始化 AudioPlayer
  AudioManager.getInstance();
  return (
    <>
      <Nav />
      <Control />
    </>
  );
}

export default App;
