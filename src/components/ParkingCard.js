import React from 'react';
import { View, Text, StyleSheet, Image,  Dimensions, TouchableOpacity, TouchableHighlight} from 'react-native'
import { useNavigation } from '@react-navigation/native';


const ParkingCard = (props) => {

    const navigation = useNavigation();

    const handleCardPress = () => {
      navigation.navigate('ParkingInfo');
    };

    const deviceWidth = Math.round(Dimensions.get('window').width);
    const styles = StyleSheet.create({
        container:{
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',

        },
        heading:{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 130,
            fontSize: 20,
            fontWeight: '500',


        },
        card: {
            width: deviceWidth - 120
            ,
            backgroundColor: '#FFFFFF',
            height: 200,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center', 

            shadowColor: '#000',
            shadowOffset:{
                width:5,
                height:5,
            },
            shadowOpacity:0.75,
            elevation: 9,
            
        },
        image: {
            width: 220,
            height: 100,
            borderRadius: 10,
            paddingBottom: 50,
        },
          content: {
            flex: 1,
            padding: 16,
          },
          title: {
            fontSize: 20,
            fontWeight: 'bold',

          },
          location: {
            fontSize: 16,
            color: '#555555',
          },
          capacity: {
            fontSize: 16,
            color: '#555555',
          },
          availability: {
            fontSize: 16,
            color: '#2ecc71', // Green color for availability
          },
    });

    return (
        <TouchableOpacity onPress={handleCardPress}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Image
                        source={require('./parking_logo.jpg')} // Replace with your parking area image
                        style={styles.image}
                    />    
                    <Text style={styles.title}>{props.info.parkingarea}</Text>
                    <Text style={styles.capacity}>Capacity: 100 Cars</Text>
                    <Text style={styles.availability}>Available: 75</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ParkingCard;
