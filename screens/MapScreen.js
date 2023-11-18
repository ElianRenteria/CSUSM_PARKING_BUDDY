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
  Modal,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MapView, { Marker, Polygon, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel'; //npm install --save react-native-snap-carousel
import firebase from '../firebase/firebaseConfig';
import { useColorScheme} from 'react-native';
import { ColorSchemeContext } from './ColorSchemeContext';
import Table from '../components/DataTable.js';

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
    { name: "Lot PS1", latitude: 33.13195683534602, longitude: -117.15745221928886, latitudeDelta: 0.0020,      
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

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [parkingData, setParkingData] = useState([]); // Stores the parking data
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [parkedButtonPressed, setParkedButtonPressed] = useState(false);

  const updateFirebaseAndButton = async (lotName) => {
    if (selectedCard === null) {
      //No card is yet selected i.e someone has just parked, update Firebase and set the selected card 
      updateFirebasePark(lotName);
      setSelectedCard(lotName);
    } else {
      //User is already parked, so selectedCard is set to a lot
      if (selectedCard === lotName) {
        //The user pressed the leave button on the card that is set in selectedCard
        updateFirebaseLeave(lotName);
        setSelectedCard(null); //Reset the selected Card so that the user could select another one
      } else {
        //If for some reason the button on a card was pressed, while the user already selected to park in a different lot
        console.log("You cannot park in multiple lots simultaneously");
      }
    }
  };

  const updateFirebasePark = async (Lot) => {
    const databaseRef = firebase.firestore().collection('Parking Structure');
  
    try {
      const doc = await databaseRef.doc(Lot).get();
      const currentValue = doc.data().OccupationCurrent;
  
      // Add 1 to the current value and update it in Firebase
      await databaseRef.doc(Lot).update({ OccupationCurrent: currentValue + 1 });
  
      // Update the state with the modified data, so that the card can display it
      setParkingData((prevData) =>
        prevData.map((item) =>
          item.id === Lot
            ? { ...item, freeSpaces: item.freeSpaces - 1, faculty: item.faculty}
            : item
        )
      );
    } catch (error) {
      console.error('Error while updating Firebase:', error);
    }
  };
  
  const updateFirebaseLeave = async (Lot) => {
    const databaseRef = firebase.firestore().collection('Parking Structure');
  
    try {
      const doc = await databaseRef.doc(Lot).get();
      const currentValue = doc.data().OccupationCurrent;
  
      // Subtract 1 from the current value and update it in Firebase
      await databaseRef.doc(Lot).update({ OccupationCurrent: currentValue - 1 });
  
      // Update the state with the modified data, so that the card can display it
      setParkingData((prevData) =>
        prevData.map((item) =>
          item.id === Lot
            ? { ...item, freeSpaces: item.freeSpaces + 1, faculty: item.faculty}
            : item
        )
      );
    } catch (error) {
      console.error('Error while updating Firebase:', error);
    }
  };

  const toggleModal = () => {
  setModalVisible(!isModalVisible);
};

  const { colorScheme } = useContext(ColorSchemeContext);
  
  const mapRef = useRef(null);


  //Function to find parking info based on document id. Returns parkingData
  const findParkingDataById = (documentId) => {
    //set some hardcoded values, so that if Firebase returns undefined the value will be 0 instead
    const { freeSpaces = 0, totalSpaces = 0, motorcycles = 0, disabledSpaces = 0, payStation = false, faculty = 0 } =
      parkingData.find((item) => item.id === documentId) || {};
    return { freeSpaces, totalSpaces, motorcycles, disabledSpaces, payStation, faculty };
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
        const freeSpaces = doc.data().TotalSpaces - doc.data().OccupationCurrent;
        const totalSpaces = doc.data().TotalSpaces;
        const motorcycles = doc.data().Motorcycle;
        const disabledSpaces = doc.data().Disabled;
        const payStation = doc.data().Paystation;
        const faculty = doc.data().Faculty_Staff;
       
        data.push({ id: doc.id, freeSpaces, totalSpaces, motorcycles, disabledSpaces, payStation, faculty});
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
          <Text style = {styles.cardText}>Total disabled parking spots: {item.disabledSpaces ? item.disabledSpaces : 0} </Text>
          <Text style = {styles.cardText}>Total motorcycle parking spots: {item.motorcycles ? item.motorcycles : 0 }</Text>
          <Text style = {styles.cardText}>Total parking spots exclusively for faculty/staff: {item.faculty ? item.faculty : 0 }</Text>
          <Text style = {styles.cardText}>Is there a paystation: {item.payStation ? 'Yes' : 'No'}</Text>
        </View>
      )}
      {/*Set isCardExpanded when clicked to either expand or shrink*/}
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          isCardExpanded && { backgroundColor: 'red' },
          selectedCard === item.name 
            ? { backgroundColor: 'green' } //If a button is pressed, the button turns green
            : parkedButtonPressed
            ? { backgroundColor: 'grey' } //If a button is pressed, all other buttons are grey
            : { backgroundColor: '#00FF00' }, //This is the default state, if no button has been pressed
        ]}
        onPress={() => {
          if (selectedCard === item.name) {
            //If the button on the parked card is pressed again
            setParkedButtonPressed(false); //Set that no button has been pressed i.e. user left parking lot
            updateFirebaseAndButton(item.name);
            
          } else {
            //When a button is pressed for the first time
            updateFirebaseAndButton(item.name);
            setParkedButtonPressed(true); //Set that a button has been pressed i.e. user has parked
            setSelectedCard(item.name); //Set selectedCard to the one where the user is parking
          }
        }}
        disabled={parkedButtonPressed && selectedCard !== item.name} //Disable all buttons except for the "parked" one
      >
        <Text style={styles.cardText}>{selectedCard === item.name ? 'Leave' : 'Park'}</Text>
      </TouchableOpacity>

    </View>
  );
};




  //console.log('Combined Data:', combinedData)

  return (
    <View style={{ flex: 1 }}>
      <Button title="Listview" onPress={toggleModal}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <Table />
          <View>
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },


});




export default MapScreen;
