import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const PreferencesScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSwitch = () => {
    setIsDarkMode(previousState => !previousState);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#333' : '#fff',
      }}
    >
      <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
        Dark Mode {isDarkMode ? 'Enabled' : 'Disabled'}
      </Text>
      <Switch
        trackColor={{ false: '#81b0ff', true: '#007AC3' }}
        thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isDarkMode}
      />
    </View>
  );
};

export default PreferencesScreen;