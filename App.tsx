/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Control from './components/control';
import Nav from './route';

function App(): JSX.Element {
  return (
    <>
      <Nav />
      <Control />
    </>
  );
}

export default App;
