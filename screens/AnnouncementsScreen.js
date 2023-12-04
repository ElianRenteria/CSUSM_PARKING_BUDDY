import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, Modal, Text, TextInput, Button } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import NotificationHistory from '../NotificationHistory';
import AnnouncementCard from '../AnnouncementCard';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from './ColorSchemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const NotificationsScreen = () => {
  const { colorScheme } = useContext(ColorSchemeContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: colorScheme === 'dark' ? '#282828' : 'white',
    },
    historyIcon: {
      position: 'absolute',
      top: 20, // Adjust as needed for your header
      right: 20,
      zIndex: 10, // Make sure it floats above other components
    },
    cardContainer: {
      backgroundColor: colorScheme === 'dark' ? '#282828' : 'white',
    },
    scrollView: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingTop: 60, // Adjust this value based on the size of your bell icon
    },
    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#282828', // Adjust color as needed
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    colorPickerTitle: {
      fontSize: 16,
      marginTop: 10,
    },
    colorOptionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
      marginBottom: 20,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2, // Add a border
      borderColor: '#000000', // Make the border black
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: 50, // Adjust as needed
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    input: {
      width: '80%', // Adjust as needed
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
    },
  });

  const selectColor = (color) => {
    setNewAnnouncement({ ...newAnnouncement, backgroundColor: color });
  };

  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const notifications = [


  ];

  const [announcements, setAnnouncements] = useState([
    // Preload with existing announcements or fetch from AsyncStorage
  ]);

  const colorOptions = ['#FFFFFF', '#FF5733', '#33FF57', '#3357FF', '#F333FF']; // Define your color palette


  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    imageUrl: '',
    backgroundColor: '#FFFFFF' // Default background color
  });

  // Function to add the new announcement
  const handleAddAnnouncement = () => {
    // Generate a unique ID for the new announcement
    const newId = Math.max(0, ...announcements.map(a => a.id)) + 1;
    const announcementToAdd = { ...newAnnouncement, id: newId };

    // Add the new announcement to the announcements state
    setAnnouncements([...announcements, announcementToAdd]);

    // Reset the new announcement state and close the modal
    setNewAnnouncement({ id: '', title: '', description: '', imageUrl: '', backgroundColor: '#FFFFFF' });
    setAddModalVisible(false);

    // Optionally, save to AsyncStorage or backend
    saveAnnouncements(announcements);
  };

  const saveAnnouncementsToStorage = async (announcements) => {
    try {
      const jsonValue = JSON.stringify(announcements);
      await AsyncStorage.setItem('@announcements', jsonValue);
    } catch (e) {
      // saving error
    }
  };


  const addAnnouncement = (newAnnouncement) => {
    setAnnouncements([...announcements, newAnnouncement]);
    saveAnnouncements([...announcements, newAnnouncement]);
  };

  const editAnnouncement = (editedAnnouncement) => {
    const updatedAnnouncements = announcements.map(announcement =>
      announcement.id === editedAnnouncement.id ? editedAnnouncement : announcement
    );
    setAnnouncements(updatedAnnouncements);
    saveAnnouncements(updatedAnnouncements);
  };

  // Function to delete an announcement
  const deleteAnnouncement = (id) => {
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
    setAnnouncements(updatedAnnouncements);
    // Optionally, update AsyncStorage or backend
    saveAnnouncementsToStorage(updatedAnnouncements);
  };

  const saveAnnouncements = async (newAnnouncements) => {
    await AsyncStorage.setItem('announcements', JSON.stringify(newAnnouncements));
  };

  const loadAnnouncementsFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@announcements');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
    }
  };

  // In your component
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const loadedAnnouncements = await loadAnnouncementsFromStorage();
      setAnnouncements(loadedAnnouncements);
    };

    fetchAnnouncements();
  }, []);

  const toggleHistory = () => {
    setHistoryVisible(!isHistoryVisible);
  };

  const [isAddModalVisible, setAddModalVisible] = useState(false);

  // Function to handle adding a new announcement
  const handleAddPress = () => {
    setAddModalVisible(true);
  };

  // Function to handle the closing of the add announcement modal
  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleHistory} style={styles.historyIcon}>
        <Icon name="bell" type="feather" color={colorScheme === 'dark' ? 'white' : '#282828'} />
      </TouchableOpacity>


      <ScrollView style={styles.scrollView}>
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            id={announcement.id}
            title={announcement.title}
            text={announcement.description}
            imageUrl={announcement.imageUrl}
            backgroundColor={announcement.backgroundColor}
            onDelete={deleteAnnouncement}
          />
        ))}
      </ScrollView>

      <NotificationHistory
        isVisible={isHistoryVisible}
        onClose={toggleHistory}
        notifications={notifications}
      />

      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.addButton}>
        <Icon name="plus" type="feather" color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={handleCloseAddModal}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Create Announcement</Text>
          <TouchableOpacity onPress={handleCloseAddModal} style={styles.closeButton}>
            <Icon name="x" type="feather" color="#282828" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, title: text })}
            value={newAnnouncement.title}
            placeholder="Title"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, description: text })}
            value={newAnnouncement.description}
            placeholder="Description"
            multiline
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, backgroundColor: text })}
            value={newAnnouncement.backgroundColor}
            placeholder="Background Color"
          />
          <Text style={styles.colorPickerTitle}>Select a Background Color:</Text>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.colorOption, { backgroundColor: color }]}
                onPress={() => selectColor(color)}
              />
            ))}
          </View>

          <Button title="Create Announcement" onPress={handleAddAnnouncement} />
        </View>
      </Modal>
    </View>
  );
};



export default NotificationsScreen;