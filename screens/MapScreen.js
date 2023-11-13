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
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MapView, { Marker, Polygon, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel'; //npm install --save react-native-snap-carousel
import firebase from '../firebase/firebaseConfig';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from './ColorSchemeContext';

//Coordinates for San Marcos
const sanmarcos = {
  latitude: 33.1298,
  longitude: -117.1587,
  latitudeDelta: 0.0043,
  longitudeDelta: 0.0034,
};

//Coordinates for CSUSM lots
const csusmCoord = {
  markers: [],
  coordinates: [
    { name: "Lot XYZ", latitude: 33.12818710963282, longitude: -117.16400434858764, latitudeDelta: 0.003,      
    longitudeDelta: 0.0024 },
    { name: "Lot B", latitude: 33.126669821191214, longitude: -117.16304178645065, latitudeDelta: 0.0023,      
    longitudeDelta: 0.0019 },
    { name: "Lot C", latitude: 33.12640540098678, longitude: -117.16106783721526, latitudeDelta: 0.0018,      
    longitudeDelta: 0.002 },
    { name: "Lot F", latitude: 33.12588302136077, longitude: -117.15709431991596, latitudeDelta: 0.0023,      
    longitudeDelta: 0.0035 },
    { name: "PS1", latitude: 33.13195683534602, longitude: -117.15745221928886, latitudeDelta: 0.0020,      
    longitudeDelta: 0.00104},
    { name: "Lot N", latitude: 33.132603715329026, longitude: -117.15648318361112, latitudeDelta: 0.002,      
    longitudeDelta: 0.0009},
    { name: "Lot J", latitude: 33.13347804216178, longitude: -117.15331481913803, latitudeDelta:.002 , longitudeDelta:.001},
    { name: "Lot K", latitude:33.134066562234 , longitude: -117.15528486384052+.0001, latitudeDelta: .002 , longitudeDelta:.0001},
    { name: "Lot O", latitude: 33.13277732264146, longitude: -117.15819923081247+.00001, latitudeDelta:.002, longitudeDelta:.0001},
    { name: "Lot L", latitude: 33.13225349810222, longitude: -117.15945690471221, latitudeDelta:.002, longitudeDelta:.00001},
    { name: "PS2", latitude: 33.13385152148427, longitude: -117.16092577290546, latitudeDelta:.002, longitudeDelta:.00005},

  ],
};

const MapScreen = () => {
  const { colorScheme } = useContext(ColorSchemeContext);
  // Stores the parking data
  const [parkingData, setParkingData] = useState([]);

  const [isCardExpanded, setIsCardExpanded] = useState(false);



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
        const freeSpaces = doc.data().OccupationCurrent;
        const totalSpaces = doc.data().TotalSpaces
        data.push({ id: doc.id, freeSpaces, totalSpaces});
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

const renderCarouselItem = ({ item }) => {
  return (
    <View style={[styles.shadowProp,styles.cardContainer]}>
     
      <Text style={styles.cardTitle}>{item.name}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.cardText}>Free Spaces: </Text>
        <Text style={styles.freeSpacesValue}>{item.freeSpaces}</Text>
      </View>
      <Text style={styles.cardText}>Total Spaces: {item.totalSpaces}</Text>
      {/*When the card is expanded, add more info*/}
      {isCardExpanded && (
        <View>
          <Text style = {styles.cardText}>Additional Information:</Text>
          <Text style = {styles.cardText}>More details about the parking lot can be shown here.</Text>
          <Text style = {styles.cardText}>Include any other relevant information you want to display.</Text>
        </View>
      )}
      {/*Set isCardExpanded when clicked to either expand or shrink*/}
      <TouchableOpacity
         style={[styles.buttonContainer, isCardExpanded && { backgroundColor: 'red' }]}
         onPress={() => console.log("Lot: " + item.name )}
      >
        <Text style={styles.cardText}>Park</Text>
      </TouchableOpacity>
    </View>
  );
};




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
        sliderWidth={Dimensions.get('window').width} // Set it to the width of your screen
        itemWidth={376} // Set it to the width of a single card item
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
    bottom: -30,
    marginBottom: 48,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: 'white',
    height: 200,
    width: 370,
    padding: 24,
    borderRadius: 24,
  },
  animatedContainer:{
    position: 'absolute',
    width: "100%",
    height: 100,
    bottom: 0,
    left: 0,
    backgroundColor: 'red',
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
    color: 'black',
    fontSize: 22,
    alignSelf: 'center'
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  heading:{
    color: 'black',
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
    height: 40,
    width: 300,
    borderRadius: 12,
    left: '5%', // Position the button at the horizontal center of the cardContainer
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#00FF00',
    borderRadius:100,
    borderWidth: 1,
    borderColor: '#fff'
  },
  selectLot:{
    color: 'red',
    position:'abolute',
    bottom: '0',
    backgroundColor: 'white',
  },
  cardText:{
    color: 'black',
    fontSize: 16,
  },
  freeSpacesValue:{
    color: '#90EE90',
    fontSize: 16,
  },
   expandedCard: {
    height: 500, // You can adjust the height as needed


  },
  inputBox:{
    color: 'white',
    backgroundColor: 'white',
  }


});




export default MapScreen;
