//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import { Button } from "native-base";
import { Center, Square, Circle } from 'native-base';
import { Flex, Spacer } from "native-base";

//Using NativeBase for UI

export default function App() {
  
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Box>Hello world</Box>
        <Box alignItems="center">
          <Button onPress={() => console.log("hello world")}>Click Me</Button>
        </Box>   
      </Center>
    </NativeBaseProvider>
  );
}


/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/
