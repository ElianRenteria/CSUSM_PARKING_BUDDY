import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, useColorScheme } from 'react-native';

const PreferencesScreen = () => {
  const colorScheme = useColorScheme();
  const [isWorking, setIsWorking] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
    },
    text: {
      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dark Mode {isWorking ? 'not working' : '10% working'}</Text>
      <Switch
        trackColor={{ false: '#81b0ff', true: '#007AC3' }}
        thumbColor={'#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
        onChange={() => {
          if (isEnabled == true) setIsWorking(true);
          else if (isEnabled == false) setIsWorking(false);
        }}
      />
    </View>
  );
};

export default PreferencesScreen;

