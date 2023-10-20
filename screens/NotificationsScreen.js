import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { DarkModeContext } from './DarkModeContext';

const NotificationsScreen = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#333' : '#fff',
      }}
    >
      <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Notifications Screen</Text>
    </View>
  );
};

export default NotificationsScreen;
