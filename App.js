import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import { Button } from "native-base";
import { Center, Square, Circle } from 'native-base';
import { Flex, Spacer } from "native-base";
import { Menu } from 'native-base';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

//Use NativeBase for UI

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
