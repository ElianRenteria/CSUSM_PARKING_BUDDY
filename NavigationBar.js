// NavigationBar.js

import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
//import NavBarBtn from './NavBarBtn';
import { Button, Box, Center, NativeBaseProvider, HStack, colorMode} from "native-base"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function Example() {
  return (
      <HStack space = {4} alignItems="start" height={90} justifyContent={'center'} width={windowWidth-55}>
        <Button height={75} width={75} onPress={() => console.log("home")}>home</Button>
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