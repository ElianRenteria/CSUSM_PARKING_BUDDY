import React, { useRef, useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, Alert, Platform, Dimensions, Button, Modal, TextInput, TouchableOpacity, Animated, } from 'react-native';
import MapView, { Marker, Polygon, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel'; //npm install --save react-native-snap-carousel
import firebase from '../firebase/firebaseConfig';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from './ColorSchemeContext';
import Table from '../components/DataTable.js';
import * as Notifications from 'expo-notifications';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from '@rneui/themed';


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
    {
      name: "Lot XYZ", latitude: 33.12818710963282, longitude: -117.16400434858764, latitudeDelta: 0.003,
      longitudeDelta: 0.0024
    },
    {
      name: "Lot B", latitude: 33.126669821191214, longitude: -117.16304178645065, latitudeDelta: 0.0023,
      longitudeDelta: 0.0019
    },
    {
      name: "Lot C", latitude: 33.12640540098678, longitude: -117.16106783721526, latitudeDelta: 0.0018,
      longitudeDelta: 0.002
    },
    {
      name: "Lot F", latitude: 33.12588302136077, longitude: -117.15709431991596, latitudeDelta: 0.0023,
      longitudeDelta: 0.0035
    },
    {
      name: "Lot PS1", latitude: 33.13195683534602, longitude: -117.15745221928886, latitudeDelta: 0.0020,
      longitudeDelta: 0.00104
    },
    {
      name: "Lot N", latitude: 33.132603715329026, longitude: -117.15648318361112, latitudeDelta: 0.002,
      longitudeDelta: 0.0009
    },
    { name: "Lot J", latitude: 33.13347804216178, longitude: -117.15331481913803, latitudeDelta: .002, longitudeDelta: .001 },
    { name: "Lot K", latitude: 33.134066562234, longitude: -117.15528486384052 + .0001, latitudeDelta: .002, longitudeDelta: .0001 },
    { name: "Lot O", latitude: 33.13277732264146, longitude: -117.15819923081247 + .00001, latitudeDelta: .002, longitudeDelta: .0001 },
    { name: "Lot L", latitude: 33.13225349810222, longitude: -117.15945690471221, latitudeDelta: .002, longitudeDelta: .00001 },
    { name: "PS2", latitude: 33.13385152148427, longitude: -117.16092577290546, latitudeDelta: .002, longitudeDelta: .00005 },

  ],
};


const MapScreen = () => {
  //use banner to prompt user for access to machine for push notifications until they allow
  const [showBanner, setShowBanner] = useState(true);
    //Values for dropdown picker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [floors, setFloors] = useState([
      {label: 'Floor 1', value: 'apple'},
      {label: 'Floor 2', value: 'banana'},
      {label: 'Floor 3', value: 'pear'},
      {label: 'Floor 4', value: 'Lychee'},
      {label: 'Floor 5', value: "Poop"},
  ]);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      setShowBanner(false);
    }
  };

  const handleEnableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setShowBanner(false);
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  

  //notification for parking in selected lot
  async function sendNotificationParked(lotName) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "MyCSUSM Parking Buddy",
        body: 'You parked in ' + lotName,
      },
      trigger: null,
    });
  }

  //notification for unparking from selected lot
  async function sendNotificationUnParked(lotName) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "MyCSUSM Parking Buddy",
        body: 'You\'ve left ' + lotName,
      },
      trigger: null,
    });
  }


  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [parkingData, setParkingData] = useState([]); // Stores the parking data
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [parkedButtonPressed, setParkedButtonPressed] = useState(false);

  const updateFirebaseAndButton = async (lotName) => {
    if (selectedCard === null) {
      //No card is yet selected i.e someone has just parked, update Firebase and set the selected card 
      updateFirebasePark(lotName);
      await sendNotificationParked(lotName);
      setSelectedCard(lotName);
    } else {
      //User is already parked, so selectedCard is set to a lot
      if (selectedCard === lotName) {
        //The user pressed the leave button on the card that is set in selectedCard
        updateFirebaseLeave(lotName);
        await sendNotificationUnParked(lotName);
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
            ? { ...item, freeSpaces: item.freeSpaces - 1, faculty: item.faculty }
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
            ? { ...item, freeSpaces: item.freeSpaces + 1, faculty: item.faculty }
            : item
        )
      );
    } catch (error) {
      console.error('Error while updating Firebase:', error);
    }
  };


  const leaveAlert = (item) => {
    Alert.alert(
      'Are you sure you want to leave?',
      '',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            setParkedButtonPressed(true);

          },
        },
        {
          text: 'Yes',
          onPress: () => {
            updateFirebaseAndButton(item.name);  // Corrected function call

          },
        },
      ],
      { cancelable: false }
    );
  };

  //Alert function that passes data to update the database when user wants to park
  const parkAlert = (item) => {
    Alert.alert(
      'Are you sure you want to park here?',
      '',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            setParkedButtonPressed(false); 
            setSelectedCard(null);

          },
        },
        {
          text: 'Yes',
          onPress: () => {
            updateFirebaseAndButton(item.name);

          },
        },
      ],
      { cancelable: false }
    );
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

        data.push({ id: doc.id, freeSpaces, totalSpaces, motorcycles, disabledSpaces, payStation, faculty });
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
        latitude: location.latitude - .0004,
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

    //Handles the card expanding when the button is pressed, uses animation to make the card slide up
    const handlePress = () =>{
      setIsCardExpanded(!isCardExpanded);
    };
  
  

  const renderCarouselItem = ({ item }) => {
    const containerStyle = [
      styles.shadowProp,
      styles.cardContainer,
      {height : isCardExpanded ? 400 : 200},
    ];

    return (
      
      <View style={containerStyle}>
     
     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Lot Title */}
        <Text style={styles.cardTitle}>{item.name}</Text>

         {/*If item.name === Ps1 then execute stuff in parenthesis following ?, if not then execute stuff after null*/}
         {item.name === "Lot PS1" ? (
            <View style={{position: 'relative', height: 50,zIndex: 2, width: 150}}>
              <DropDownPicker 
                open={open}
                value={value}
                items={floors}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setFloors}
                placeholder={'Choose a floor'}
                style={{ zIndex: 1000 }}  
              />
            </View>
            ): null}

        {/* Expand Button */}
        <TouchableOpacity onPress={handlePress}>
          {/* If card is expanded, use chevron down, else do chevron up*/}
          <Icon name={isCardExpanded ? 'chevron-down' : 'chevron-up'} size={24} />
        </TouchableOpacity>
      </View>

      <Divider style = {styles.dividerLine} inset={true} insetType="right" />


        {/*When the card is expanded, add more info under free spaces*/}
        {isCardExpanded && (
          <View>
           <Text style={styles.subHeading}>Parking Features</Text>
           <Text style = {styles.infoText}>Motorcycle Parking: {item.motorcycles}</Text>
           <Text style = {styles.infoText}>Disabled Parking: {item.disabledSpaces}</Text>
           <Text style = {styles.infoText}>Faculty Parking: {item.faculty}</Text>
           <Text style = {styles.infoText}>Paystation: {item.Paystation}</Text>



           <Divider style = {styles.dividerLine} inset={true} insetType="right" />

         
         </View> 
      )}

        
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.cardText}>Free Spaces: </Text>
          <Text style={styles.freeSpacesValue}>{item.freeSpaces}</Text>
        </View>
        <Text style={styles.cardText}>Total Spaces: {item.totalSpaces}</Text>
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
              leaveAlert(item);
            } else {
              //When a button is pressed for the first time
              parkAlert(item);
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
      {showBanner && (
        <View style={styles.banner}>
          <Text>Enable push notifications to stay updated!</Text>
          <Button title="Enable" onPress={handleEnableNotifications} />
        </View>
      )}
      <Button title="Listview" onPress={toggleModal} />
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
  banner: {
    backgroundColor: 'yellow',
    padding: 10,
    alignItems: 'center',
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
  animatedContainer: {
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
    shadowOffset: { width: -2, height: 4 },
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
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#00FF00',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff'
  },
  selectLot: {
    color: 'red',
    position: 'abolute',
    bottom: '0',
    backgroundColor: 'white',
  },
  cardText: {
    color: 'black',
    fontSize: 16,
  },
  freeSpacesValue: {
    color: '#90EE90',
    fontSize: 16,
  },
  expandedCard: {
    height: 500, // You can adjust the height as needed
  },
  inputBox: {
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
  inputBox: {
    color: 'white',
    backgroundColor: 'white',
  },
  dividerLine:{
    marginTop:10,
    marginBottom: 10,
  },
  infoText:{
    color: 'gray',
    position: 'relative',
    fontSize: 12,
    marginBottom: 5,
  },


});




export default MapScreen;