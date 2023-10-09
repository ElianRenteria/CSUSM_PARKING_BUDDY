import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import { Button } from "native-base";
import { Center, Square, Circle } from 'native-base';
import { Flex, Spacer } from "native-base";
import { Menu } from 'native-base';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
// App.js

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './MapScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Parking Buddy" component={MapScreen} options={{
              headerStyle: {
                backgroundColor: '#2d2d30', // Change the background color here
              },
              headerTintColor: 'white', // Change text color if needed
              headerTitleStyle: {
                fontWeight: 'bold', // You can adjust text style as well
              },
            }}/>
        {/* Add more screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
//Now, when you navigate to the "Map" screen, you will see the navigation bar at the top of the map. You can customize the NavigationBar component to include buttons, titles, or any other navigation elements you need. Additionally, you can style it according to your project's design requirements.




