import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, useColorScheme } from 'react-native';

const PreferencesScreen = () => {
  const [colorScheme, setColorScheme] = useState('light');
  const [isWorking, setIsWorking] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (isEnabled) {
      setIsWorking(true);
      setColorScheme('dark');
    } else {
      setIsWorking(false);
      setColorScheme('light');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#282828' : 'white',
    },
    text: {
      color: colorScheme === 'dark' ? 'white' : '#282828',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isWorking ? 'Dark Mode' : 'Light Mode'}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default PreferencesScreen;