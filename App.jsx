/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/FontAwesome';
import StackNavigator from './navigation/StackNavigator';
import { AuthProvider } from './AuthContext';
import { SocketContextProvider } from './SocketContext';

Icon.loadFont();


function App() {
  return (
    <AuthProvider>
    <SocketContextProvider>
      <StackNavigator />
    </SocketContextProvider>
      
    </AuthProvider>

  )
}

const styles = StyleSheet.create({

});

export default App;
