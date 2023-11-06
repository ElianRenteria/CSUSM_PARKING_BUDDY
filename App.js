import React from 'react';
import { useState, useEffect, useRef, useContext} from 'react';
import { Text, View, Button, Platform, StyleSheet,colorScheme} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationsScreen from './screens/NotificationsScreen';
import MapScreen from './screens/MapScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useColorScheme } from 'react-native';
import { ColorSchemeProvider } from './screens/ColorSchemeContext';
import { ColorSchemeContext } from './screens/ColorSchemeContext';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Notifications.scheduleNotificationAsync({
  content: {
    title: 'CSUSM Parking Buddy',
    body: "Did you Park?",
  },
  trigger: null,
});



async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync({projectId: '0e21ebb0-cf10-45be-9160-e657075d2e83'})).data;
  return token;
}


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

registerForPushNotificationsAsync()

function App() {
  const [navBarRefresh, setNavBarRefresh] = useState(false);
  const { colorScheme, setColorScheme } = useContext(ColorSchemeContext);

  useEffect(() => {
    setNavBarRefresh(!navBarRefresh);
    console.log('colorScheme: ', colorScheme);
  }, [colorScheme]);
  
  const tabOptions = {
    screenOptions: {
      tabBarIcon: ({ focused, color, size }) => {
        // ... (your tab icon settings)
      },
    },
  };
  // Define styles with different color values for light and dark mode
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#282828' : '#000000',
    },
    // Add more styles as needed
  });

  return (
    <ColorSchemeProvider>
    <NavigationContainer>
      <ColorSchemeProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: [
              {
                backgroundColor: colorScheme === 'dark' ? '#282828' : '#FFFFFF',
              },
              null
            ],
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              const colorFocused = focused ? '#007AC3' : 'grey';
  
              if (route.name === 'Announcements') {
                iconName = 'announcement';
                return <MaterialIcons name={iconName} size={24} color={colorFocused} />;
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
           <Tab.Screen name="Announcements" component={NotificationsScreen} onPress={() => useEffect()} />
        <Tab.Screen name="Parking Map" component={MapScreen} onPress={() => getLocation()} />
        <Tab.Screen name="Preferences">
          {() => <PreferencesScreen />}
        </Tab.Screen>
        </Tab.Navigator>
      </ColorSchemeProvider>
    </NavigationContainer>
    </ColorSchemeProvider>
  );
}

export default () => (
    <App />
);