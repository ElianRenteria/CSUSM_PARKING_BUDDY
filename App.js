import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationsScreen from './screens/NotificationsScreen';
import MapScreen from './screens/MapScreen';
import PreferencesScreen from './screens/PreferencesScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            screenOptions={
              "tabBarActiveTintColor": "blue",
              "tabBarInactiveTintColor": "gray",
              "tabBarStyle": [
                {
                  "display": "flex"
                },
                null
              ]
            }

            if (route.name === 'Announcements') {
              iconName = focused ? 'announcement' : 'announcement';
              colorFocused = focused ? '#007AC3' : 'grey'
              return <MaterialIcons name={iconName} size={24} color={colorFocused} />;
            } else if (route.name === 'Preferences') {
              iconName = focused ? 'account-cog-outline' : 'account-cog-outline';
              colorFocused = focused ? '#007AC3' : 'grey'
              return <MaterialCommunityIcons name={iconName} size={24} color={colorFocused} />;
            } else if (route.name === 'Parking Map') {
              iconName = focused ? 'map-o' : 'map-o';
              colorFocused = focused ? '#007AC3' : 'grey'
              return <FontAwesome name={iconName} size={24} color={colorFocused} />;
            }

            
          },
        })}
      >
        <Tab.Screen name="Announcements" component={NotificationsScreen} />
        <Tab.Screen name="Parking Map" component={MapScreen} onPress={() => getLocation()}/>
        <Tab.Screen name="Preferences" component={PreferencesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;