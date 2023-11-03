import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorSchemeContext } from './ColorSchemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PreferencesScreen = () => {
  const { colorScheme, setColorScheme } = useContext(ColorSchemeContext);
  const [isToggled, setIsToggled] = useState(false);

  const toggleSwitch = () => {
    const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newColorScheme);
    setIsToggled(!isToggled);
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
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{colorScheme} Mode</Text>
      <View style={styles.switchContainer}>
        {isToggled ? (
          <MaterialCommunityIcons name="weather-sunny" size={24} color="yellow" />
        ) : (
          <MaterialCommunityIcons name="weather-sunny" size={24} color="orange" />
        )}
        <Switch
          onValueChange={toggleSwitch}
          value={isToggled}
          thumbColor={isToggled ? '#f8f9f9' : 'orange'}
          trackColor={{ false: 'yellow', true: 'darkblue' }}
        />
        {isToggled ? (
          <MaterialCommunityIcons name="weather-night" size={24} color="#f8f9f9" />
        ) : (
          <MaterialCommunityIcons name="weather-night" size={24} color="black" />
        )}
      </View>
    </View>
  );
};

export default PreferencesScreen;
