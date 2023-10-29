import React from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';




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




const MapScreen = () => (
  <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 33.1298,
          longitude: -117.1587,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034
        }}
      />
    </View>
);

export default MapScreen;