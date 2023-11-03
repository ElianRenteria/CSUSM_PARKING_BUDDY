import React, { useRef, useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Platform,
  Dimensions,
  Button,
} from 'react-native';
import MapView, { Marker, Polygon, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel'; //npm install --save react-native-snap-carousel
import firebase from '../firebase/firebaseConfig';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from './ColorSchemeContext';




const sanmarcos = {
  latitude: 33.1298,
  longitude: -117.1587,
  latitudeDelta: 0.0043,
  longitudeDelta: 0.0034,
};

const csusmCoord = {
  markers: [],
  coordinates: [
    { name: "PS1", latitude: 33.13195683534602, longitude: -117.15745221928886, latitudeDelta: 0.0020,      
    longitudeDelta: 0.00104},
    { name: "Lot N", latitude: 33.132603715329026, longitude: -117.15648318361112, latitudeDelta: 0.002,      
    longitudeDelta: 0.0009},
    { name: "Lot F", latitude: 33.12588302136077, longitude: -117.15709431991596, latitudeDelta: 0.0023,      
    longitudeDelta: 0.0035 },
    { name: "Lot C", latitude: 33.12640540098678, longitude: -117.16106783721526, latitudeDelta: 0.0018,      
    longitudeDelta: 0.002 },
    { name: "Lot XYZ", latitude: 33.12818710963282, longitude: -117.16400434858764, latitudeDelta: 0.003,      
    longitudeDelta: 0.0024 },
    { name: "Lot B", latitude: 33.126669821191214, longitude: -117.16304178645065, latitudeDelta: 0.0023,      
    longitudeDelta: 0.0019 },
  ],
};

const MapScreen = () => {
  const { colorScheme } = useContext(ColorSchemeContext);
  // Stores the parking data
  const [parkingData, setParkingData] = useState([]);

  const mapRef = useRef(null);


  //Function to find parking info based on document id. Returns parkingData
  const findParkingDataById = (documentId) => {
    const parkingDataItem = parkingData.find((item) => item.id === documentId);
    return parkingDataItem || {};
  };

  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        };

        mapRef.current.animateToRegion(region, 500);
      } else {
        // Handle permission denied or restricted case
      }
    }

    getLocation();
  }, []);

  useEffect(() => {
    // Reference to the "Parking Spaces" collection
    const parkingRef = firebase.firestore().collection('Parking Structure');

    // Fetch the data
    parkingRef.get().then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        // Access the "Free Spaces" field
        const freeSpaces = doc.data().FreeSpaces;
        data.push({ id: doc.id, freeSpaces});
      });
      // Set the retrieved data in the state
      setParkingData(data);
    }).catch((error) => {
      console.error('Error fetching parking data:', error);
    });
  }, []);

  //Merge coordinates & firebase data to use on carousel
  const combinedData = csusmCoord.coordinates.map((csusmCoordItem) => {
    const parkingDataItem = findParkingDataById(csusmCoordItem.name);
    return {
      ...csusmCoordItem,
      ...parkingDataItem,
    };
  });
  

// Animate to the next marker when the carousel changes
const onCarouselItemChange = (index) => {
  let location = combinedData[index];

  if (location.latitude !== -1 && location.longitude !== -1) {
    
    mapRef.current.animateToRegion({
      latitude: location.latitude-.0004,
      longitude: location.longitude,
      latitudeDelta: location.latitudeDelta,      
      longitudeDelta: location.longitudeDelta,
    });

    // Show the callout marker of the coordinate after animating to the region
    //csusmCoord.markers[index]?.showCallout();
  }
};

// Animate the screen to the next
const onMarkerPressed = (location, index) => {
  if (location.latitude !== 0 && location.longitude !== 0) {
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      
    });

    this._carousel.snapToItem(index);
  }
};








  // Rendering parking cards
  const renderCarouselItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.cardText}>Free Spaces: </Text>
        <Text style={styles.freeSpacesValue}>{item.freeSpaces}</Text>
      </View>
      <Text style={styles.cardText}>Total Spaces: {item.freeSpaces}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Select Lot"
          style={styles.selectLot}
          onPress={() => Alert.alert("Button pressed")}
        />
      </View>
      <Image style={styles.cardImage} />
    </View>
  );

  //console.log('Combined Data:', combinedData)

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={sanmarcos}
        ref={mapRef}
        mapType={colorScheme === 'dark' ? 'mutedStandard' : 'standard'}
        //types = standard, satellite, hybrid, terrain, mutedStandard
      >
        <Text style={styles.heading}>Select a parking Area</Text>
        {combinedData.map((marker, index) => (
          <Marker
            key={marker.name}
            ref={(ref) => (csusmCoord.markers[index] = ref)}
            onPress={() => onMarkerPressed(marker, index)}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          >
            <Callout>
              <Text>{marker.name}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <Carousel
        ref={(c) => (this._carousel = c)}
        data={combinedData}
        containerCustomStyle={styles.carousel}
        renderItem={renderCarouselItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={300}
        removeClippedSubviews={false}
        onSnapToItem={(index) => onCarouselItemChange(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 48,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 200,
    width: 300,
    padding: 24,
    borderRadius: 24,
  },
  cardImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center'
  },
  heading:{
    color: 'white',
    position: 'absolute',
    fontWeight: 'bold',
    top: '83.5%', // Position the heading at the vertical center of the cardContainer
    left: '50%', // Position the heading at the horizontal center of the cardContainer
    transform: [{ translateX: -80 }, { translateY: 65 }], // Center the heading precisely
    padding: 12, // Add some padding for better visibility
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Match the background of the container
  },
  buttonContainer: {
    justifyContent: 'flex-end', // Vertically align to the bottom
    alignItems: 'center', // Horizontally align to the center
    backgroundColor: 'white', // White background color
    height: 40,
    width: 100,
    borderRadius: 12,
    left: '31%', // Position the button at the horizontal center of the cardContainer
  },
  selectLot:{
    color: 'red',
    position:'abolute',
    bottom: '0',
    backgroundColor: 'white'
  },
  cardText:{
    color: 'white',
    fontSize: 16,
  },
  freeSpacesValue:{
    color: '#90EE90',
    fontSize: 16,
  }


});




export default MapScreen;