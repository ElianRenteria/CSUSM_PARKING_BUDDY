import React, {useState} from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';



const PreferencesScreen = () => {

  const [isWorking, setIsWorking] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return( 
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Dark Mode {isWorking ? 'not working' : '10% working'}</Text>
    <Switch
        trackColor={{false: '#81b0ff', true: '#007AC3'}}
        thumbColor={'#f4f3f4'}
        backgroundColor="ffffff"
        onValueChange={toggleSwitch}
        value={isEnabled}
        onChange= {() => {
          if (isEnabled == true)
            setIsWorking(true);
          else if (isEnabled == false)
            setIsWorking(false);
        }}
      />
  </View>
  )
};

export default PreferencesScreen;