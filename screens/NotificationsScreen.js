import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from './ColorSchemeContext';

const NotificationsScreen = () => {
  const { colorScheme } = useContext(ColorSchemeContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorScheme === 'dark' ? '#282828' : 'white',
    },
    text: {
      color: colorScheme === 'dark' ? 'white' : '#282828',
    },
  }
  );
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notifications Screen</Text>
    </View>
  );
};
export default NotificationsScreen;
