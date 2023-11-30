import React from 'react';
import { useState, useEffect, useRef, useContext} from 'react';
import { Text, View, Button, Platform, StyleSheet,colorScheme, useColorScheme} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationsScreen from './screens/AnnouncementsScreen';
import MapScreen from './screens/MapScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { ColorSchemeProvider } from './Themes/ColorSchemeContext';
import { ColorSchemeContext } from './Themes/ColorSchemeContext';
//import { background } from 'native-base/lib/typescript/theme/styled-system';

const Tab = createBottomTabNavigator();

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync(); // Request location permissions

  if (status === 'granted') {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.0043,
      longitudeDelta: 0.0034
    };
    console.log(latitude, longitude)
    map.current.animateToRegion(region, 500);
    return region;
  } else {
    // Handle permission denied or restricted case
  }
}

function App() {
  const { colorScheme, setColorScheme } = useContext(ColorSchemeContext);

  
  const tabOptions = {
    screenOptions: {
      tabBarIcon: ({ focused, color, size }) => {
        // ... (your tab icon settings)
      },
    },
  };

  return (
    <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: [
              {backgroundColor: colorScheme === 'dark' ? '#282828' : '#FFFFFF'}
            ],
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#282828' : '#FFFFFF', // Change the background color of the header
            },
            headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#282828', // Change the text color of the header
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              const colorFocused = focused ? '#007AC3' : 'grey';
              if (route.name === 'Announcements') {
                iconName = 'announcement';
                return <MaterialIcons name={iconName} size={24} color={colorFocused}/>;
              } else if (route.name === 'Preferences') {
                iconName = 'account-cog-outline';
                return <MaterialCommunityIcons name={iconName} size={24} color={colorFocused} />;
              } else if (route.name === 'Parking Map') {
                iconName = 'map-o';
                return <FontAwesome name={iconName} size={24} color={colorFocused} />;
              }
            },
          }
          )}
          
        >
           <Tab.Screen name="Announcements" component={NotificationsScreen} options={{
              title: 'Announcements',
              headerTintColor: colorScheme === 'dark' ? 'white' : 'black', // Add this line to set the color of the screen name
            }}/>
        <Tab.Screen name="Parking Map" component={MapScreen} onPress={() => getLocation()} />
        <Tab.Screen name="Preferences">
          {() => <PreferencesScreen />}
        </Tab.Screen>
        </Tab.Navigator>
    </NavigationContainer>
  );
}

export default () => (
  <ColorSchemeProvider>
    <App />
  </ColorSchemeProvider>
);