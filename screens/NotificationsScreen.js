import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import NotificationHistory from '../NotificationHistory';
import AnnouncementCard from '../AnnouncementCard';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from './ColorSchemeContext';

const NotificationsScreen = () => {
  /*const { colorScheme } = useContext(ColorSchemeContext);
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
  });*/
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const notifications = [

  ];
  const announcements = [
    {
      id: 1,
      title: 'Welcome to the CSUSM Parking App',
      text: 'Check out our hints page for a tutorial',
      imageUrl: '/assets/ParkingBuddySplash2.png',
    },
    {
      id: 2,
      title: 'Announcement 2',
      text: 'This is the second announcement...',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      title: 'Announcement 3',
      text: 'This is the third announcement...',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 4,
      title: 'Announcement 4',
      text: 'This is the fourth announcement...',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 5,
      title: 'Announcement 5',
      text: 'This is the fifth announcement...',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 6,
      title: 'Announcement 6',
      text: 'This is the sixth announcement...',
      imageUrl: 'https://via.placeholder.com/100',
    },
  ];

  const toggleHistory = () => {
    setHistoryVisible(!isHistoryVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleHistory} style={styles.historyIcon}>
        <Icon name="bell" type="feather" />
      </TouchableOpacity>


      <ScrollView style={styles.container}>
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            title={announcement.title}
            text={announcement.text}
            imageUrl={announcement.imageUrl}
          />
        ))}
      </ScrollView>

      <NotificationHistory
        isVisible={isHistoryVisible}
        onClose={toggleHistory}
        notifications={notifications}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  historyIcon: {
    position: 'absolute',
    top: 20, // Adjust as needed for your header
    right: 20,
    zIndex: 10, // Make sure it floats above other components
  },
});

export default NotificationsScreen;