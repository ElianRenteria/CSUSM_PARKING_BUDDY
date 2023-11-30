import React, { useRef, useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, Alert, Platform, Dimensions, Button, Modal, TextInput, TouchableOpacity, Animated, } from 'react-native';
import MapView, { Marker, Polygon, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel'; //npm install --save react-native-snap-carousel
import firebase from '../firebase/firebaseConfig';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from '../Themes/ColorSchemeContext.js';
import Table from '../components/DataTable.js';
import * as Notifications from 'expo-notifications';





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
      name: "Lot XYZ", latitude: 33.12898710963282, longitude: -117.16382034858764, latitudeDelta: 0.003,
      longitudeDelta: 0.0024, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 360, height: 230,transform: [{ rotate: '-83deg' }]}
    },
    {
      name: "Lot B", latitude: 33.126669821191214, longitude: -117.16304178645065, latitudeDelta: 0.0023,
      longitudeDelta: 0.0019, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}
    },
    {
      name: "Lot C", latitude: 33.12640540098678, longitude: -117.16106783721526, latitudeDelta: 0.0018,
      longitudeDelta: 0.002, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}
    },
    {
      name: "Lot F", latitude: 33.12588302136077, longitude: -117.15709431991596, latitudeDelta: 0.0023,
      longitudeDelta: 0.0035, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}
    },
    {
      name: "Lot PS1", latitude: 33.13195683534602, longitude: -117.15745221928886, latitudeDelta: 0.0020,
      longitudeDelta: 0.00104, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}
    },
    {
      name: "Lot N", latitude: 33.132603715329026, longitude: -117.15648318361112, latitudeDelta: 0.002,
      longitudeDelta: 0.0009, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}
    },
    { name: "Lot J", latitude: 33.13347804216178, longitude: -117.15331481913803, latitudeDelta: .002, longitudeDelta: .001, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40} },
    { name: "Lot K", latitude: 33.134066562234, longitude: -117.15528486384052 + .0001, latitudeDelta: .002, longitudeDelta: .0001, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40} },
    { name: "Lot O", latitude: 33.13277732264146, longitude: -117.15819923081247 + .00001, latitudeDelta: .002, longitudeDelta: .0001, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}},
    { name: "Lot L", latitude: 33.13225349810222, longitude: -117.15945690471221, latitudeDelta: .002, longitudeDelta: .00001, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}},
    { name: "PS2", latitude: 33.13385152148427, longitude: -117.16092577290546, latitudeDelta: .002, longitudeDelta: .00005, overlay: "../mapOverlay/images/Logo_barbie.png", size: {width: 40, height: 40}},

  ],
};




const MapScreen = () => {
  //use banner to prompt user for access to machine for push notifications until they allow
  const [showBanner, setShowBanner] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const { colorScheme } = useContext(ColorSchemeContext);

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
  const [confirmPark, setConfirmPark] = useState(false);


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
            setParkedButtonPressed(false);
            closeExpandedCard();  // Call the closeExpandedCard function here
          },
        },
      ],
      { cancelable: false }
    );
  };

  //Alert function that passes data to update the database when user wants to park
  const parkAlert = (item,itemIndex) => {
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
            setParkedButtonPressed(true); 
            setConfirmPark(true);
            setSelectedCard(item.name);
            setExpandedCard(itemIndex);

          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


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
  //close expanded card
  const closeExpandedCard = () => {
    setExpandedCard(null);
  };


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
      // Set the selected parking lot when a marker is pressed
      setSelectedLot(combinedData[index]);

      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      this._carousel.snapToItem(index);
    }
  };

  const renderCarouselItem = ({item, index: itemIndex }) => {
    const isCurrentCardExpanded = expandedCard === itemIndex && selectedCard === item.name;
    const containerStyle = [
      styles.shadowProp,
      styles.cardContainer,
      {height : isCurrentCardExpanded ? 600 : 200},
    ];
    return (
      <View style={containerStyle}>

        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.cardText}>Free Spaces: </Text>
          <Text style={styles.freeSpacesValue}>{item.freeSpaces}</Text>
        </View>
        <Text style={styles.cardText}>Total Spaces: {item.totalSpaces}</Text>
        {/*When the card is expanded, add more info*/}
        {isCardExpanded && (
          <View>
            <Text style={styles.cardText}>Total disabled parking spots: {item.disabledSpaces ? item.disabledSpaces : 0} </Text>
            <Text style={styles.cardText}>Total motorcycle parking spots: {item.motorcycles ? item.motorcycles : 0}</Text>
            <Text style={styles.cardText}>Total parking spots exclusively for faculty/staff: {item.faculty ? item.faculty : 0}</Text>
            <Text style={styles.cardText}>Is there a paystation: {item.payStation ? 'Yes' : 'No'}</Text>
          </View>
        )}
        {/*Set isCardExpanded when clicked to either expand or shrink*/}
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            isCurrentCardExpanded && { backgroundColor: 'red' },
            selectedCard === item.name
              ? { backgroundColor: 'green' }
              : parkedButtonPressed
                ? { backgroundColor: 'grey' }
                : { backgroundColor: '#00FF00' },
          ]}
          onPress={() => {
            if (isCurrentCardExpanded) {
              // Handle actions when the expanded card is pressed
              leaveAlert(item);
            } else {
              // Handle actions when a card is pressed
              parkAlert(item,itemIndex);
            }
          }}
          disabled={parkedButtonPressed && selectedCard !== item.name}
        >
          <Text style={styles.cardText}>{isCurrentCardExpanded ? 'Leave' : 'Park'}</Text>
      </TouchableOpacity>

      </View>
    );
  };






  //console.log('Combined Data:', combinedData)
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
      backgroundColor: colorScheme === 'dark' ? '#282828' : 'white',
      opacity: 0.9,
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
      color: colorScheme === 'dark' ? 'white' : '#282828',
      fontSize: 22,
      alignSelf: 'center'
    },
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    heading: {
      color: colorScheme === 'dark' ? 'white' : '#282828',
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
      backgroundColor: colorScheme === 'dark' ? 'white' : '#282828',
    },
    cardText: {
      color: colorScheme === 'dark' ? 'white' : '#282828',
      fontSize: 16,
    },
    freeSpacesValue: {
      color: '#90EE90',
      fontSize: 16,
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
    button: {
        color: colorScheme === 'dark' ? 'white' : '#282828',
    }
  
  
  });

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
            <Button style={styles.button} title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
      <MapView
        style={{ flex: 1 }}
        initialRegion={sanmarcos}
        ref={mapRef}
        mapType={'standard'}
        //types = standard, satellite, hybrid, terrain, mutedStandard
        /*zoomEnabled={false}
        zoomControlEnabled={false}
        scrollEnabled={false}*/
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







export default MapScreen;