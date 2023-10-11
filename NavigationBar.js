// NavigationBar.js

import React from 'react';
import { View, Text, TouchableOpacity, Dimensions,Geolocation } from 'react-native';
import * as Location from 'expo-location';
import { Button, Box, Center, NativeBaseProvider, HStack, colorMode} from "native-base"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  } else {
    // Handle permission denied or restricted case
  }
}


function Example() {
  return (
      <HStack space = {4} alignItems="start" height={90} justifyContent={'center'} width={windowWidth-55}>
        <Button height={75} width={75} onPress={() => getLocation()}>home</Button>
        <Button height={75} width={75} onPress={() => console.log("tools")}>tools</Button>
        <Button height={75} width={75} onPress={() => console.log("carpool")}>carpool</Button>
        <Button height={75} width={75} onPress={() => console.log("parking")}>parking</Button>
      </HStack>
  )
}




const NavigationBar = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Add more navigation elements here */
        <TouchableOpacity onPress={() => navigation.navigate('ScreenName')}>
          <NativeBaseProvider>
            <Center flex={1} px="3">
              <Example />
            </Center>
          </NativeBaseProvider>
        </TouchableOpacity>
      }
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2d2d30',
    elevation: 3, // Add shadow if needed
    position: 'absolute',
    bottom: 0, // Place it at the bottom
    left: 0,
    right: 0,
  },
};

export default NavigationBar;