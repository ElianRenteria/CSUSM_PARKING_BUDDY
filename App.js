import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Use 'react-native-vector-icons/Ionicons' if you're not using Expo
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationsScreen from './screens/NotificationsScreen';
import MapScreen from './screens/MapScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            screenOptions={
              "tabBarActiveTintColor": "#007AC3",
              "tabBarInactiveTintColor": "gray",
              "tabBarStyle": [
                {
                  "display": "flex"
                },
                null
              ]
              
            }
            /*if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;*/

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
        <Tab.Screen name="Parking Map" component={MapScreen} />
        <Tab.Screen name="Preferences" component={PreferencesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
