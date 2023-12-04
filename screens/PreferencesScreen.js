import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorSchemeContext } from './ColorSchemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ColorSchemeProvider } from './ColorSchemeContext';



const PreferencesScreen = () => {
  const { colorScheme, setColorScheme } = useContext(ColorSchemeContext);
  const [isToggled, setIsToggled] = useState(false);
  const [cosmeticSwitch1, setCosmeticSwitch1] = useState(false);
  const [cosmeticSwitch2, setCosmeticSwitch2] = useState(false);

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
    additionalSwitchContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginVertical: 10,
    },
    additionalSwitch: {
      marginLeft: 10,
    },
    switchLabel: {
      marginLeft: 5,
      color: colorScheme === 'dark' ? 'white' : '#282828',
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
      <View style={styles.additionalSwitchContainer}>
        <Text style={styles.text}>EV?</Text>
        <View style={[styles.switchContainer, styles.additionalSwitch]}>
          <Switch
            onValueChange={() => setCosmeticSwitch1(!cosmeticSwitch1)}
            value={cosmeticSwitch1}
            thumbColor={'white'}
            trackColor={{ false: 'red', true: 'green' }}
          />
        </View>
      </View>

      <View style={styles.additionalSwitchContainer}>
        <Text style={styles.text}>Carpool?</Text>
        <View style={[styles.switchContainer, styles.additionalSwitch]}>
          <Switch
            onValueChange={() => setCosmeticSwitch2(!cosmeticSwitch2)}
            value={cosmeticSwitch2}
            thumbColor={'white'}
            trackColor={{ false: 'red', true: 'green' }}
          />
        </View>
      </View>
    </View>
  );
};

export default PreferencesScreen;
