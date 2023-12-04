import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { ColorSchemeContext } from './screens/ColorSchemeContext';

const AnnouncementCard = ({ id, title, text, imageUrl, onDelete }) => {
  const { colorScheme } = useContext(ColorSchemeContext);
  const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? 'white' : '#282828',
      padding: 20,
      margin: 10,
      borderRadius: 15,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    },
    deleteButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'red',
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, // Ensure it's above other elements
    },
    textContainer: {
      flex: 1,
      marginRight: 10, // Give space for the image
    },
    title: {
      fontSize: 18,
      color: colorScheme === 'dark' ? '#282828' : 'white',
      fontWeight: 'bold',
    },
    text: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#282828' : 'white',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
  });

  return (
    <View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
        <Icon name="x" type="feather" color="#fff" />
      </TouchableOpacity>
      <View style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </View>
    </View>
  );
};

export default AnnouncementCard;
