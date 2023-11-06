import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

const AnnouncementCard = ({ title, text, imageUrl }) => {
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

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default AnnouncementCard;
