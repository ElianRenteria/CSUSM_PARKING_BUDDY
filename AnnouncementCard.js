import React,{useContext} from 'react';
import {Dimensions,View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { ColorSchemeContext } from './screens/ColorSchemeContext';


const AnnouncementCard = ({ title, text, imageUrl }) => {
  const { colorScheme } = useContext(ColorSchemeContext);
  const windowWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#282828' : '#FFFFFF',
      padding: 20,
      //width: windowWidth - 80,
      margin: 10,
      borderRadius: 15, // Adjust the value as needed
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
  
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      color: colorScheme === 'dark' ? '#FFFFFF' : '#282828',
      fontWeight: 'bold',
    },
    text: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#FFFFFF' : '#282828',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
  });
  return (
    <Card>
      <View style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </View>
    </Card>
  );
};



export default AnnouncementCard;
