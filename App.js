import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { ColorSchemeProvider } from './screens/ColorSchemeContext';

import BottomTabNavigator from './navigation/TabNavigator';

function App() {
  return (
    <ColorSchemeProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </ColorSchemeProvider>
  );
}

export default App;
