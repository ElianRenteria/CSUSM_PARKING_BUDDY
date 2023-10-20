import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Card from '../components/ParkingCard';

const MapScreen = () => {
  // Create an array of items to render using FlatList
  const data = [
    { 
      parkingarea: "Parking Structure 1",
      id: '1',
     },
    { 
      parkingarea: "Parking Structure 2",
      id: '2',
   },
    { 
      parkingarea: "Lot XYZ",
      id: '3',
   },
    {
      parkingarea: "Lot F",
      id: '4' ,
  }, 
    { 
      parkingarea: "Lot C",
      id: '5' ,
  },
    { 
      parkingarea: "Lot N",
      id: '6',
   }
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <Card info={item}/>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10, // Optional margin between cards
  },
});

export default MapScreen;
