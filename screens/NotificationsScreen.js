import React from 'react';
import { View, Text } from 'react-native';
import Table from './DataTable.js';

const NotificationsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Notifications Screen</Text>
    <Table /> 
  </View>
);

export default NotificationsScreen;