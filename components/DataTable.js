import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 
import firebase from '../firebase/firebaseConfig';

OccupancyBMax = 493;
OccupancyCMax = 535;
OccupancyFMax = 1288;
OccupancyKMax = 178;
OccupancyXYZMax = 816;
OccupancyPS1Max = 1419;

// Reference to the "Parking Spaces" collection
const parkingRef = firebase.firestore().collection('Parking Structure');
//determine the color for the table row

colorPick = (OccCurrent, OccMax) => {  
  
  if ((OccCurrent/OccMax) <= 0.33){
    return "green"
  }
  else if ((OccCurrent/OccMax) <= 0.66){
    return "orange"
  }
  else if ((OccCurrent/OccMax) <= 1){
    return "red"
  }
  else {
    return "green"
  }
}

const Table = () => { 

const [parkingData, setParkingData] = useState([]);

//find the data in the array that matches the lot
const findParkingDataById = (documentId) => {

  const parkingDataItem = parkingData.find((item) => item.id === documentId);

  return parkingDataItem ? parkingDataItem.occupation : null;
};

updateFirebase = (Lot) => {

  parkingRef.doc(Lot).get()
  .then(doc => {
    const currentValue = doc.data().OccupationCurrent; //Get the current value so you can change it
    // Add 1 to the current value and update it in Firebase
    parkingRef.doc(Lot).update({ OccupationCurrent: currentValue + 1 });
  })
  .catch(error => {
    console.error('This is the error while fetching:', error);
  });

}
  

useEffect(() => {

  // Fetch the data
  parkingRef.get().then((querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      // Access the "Free Spaces" field
      const occupation = doc.data().OccupationCurrent;
      data.push({ id: doc.id, occupation});
    });
    // Set the retrieved data in the state
    setParkingData(data);
  }).catch((error) => {
    console.error('Error fetching parking data:', error);
  });
}, []);

  
  return ( //implement the table itself
    <DataTable style={styles.container}> 
      <DataTable.Header style={styles.tableHeader}> 
        <DataTable.Title>Parking Lot</DataTable.Title> 
        <DataTable.Title>Occupancy</DataTable.Title> 
        <DataTable.Title></DataTable.Title> 
      </DataTable.Header>  
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot B</DataTable.Cell> 
        <DataTable.Cell>{findParkingDataById('Lot B')}/{OccupancyBMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(findParkingDataById('Lot B'),OccupancyBMax)}></DataTable.Cell>  
      </DataTable.Row> 
  
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot C</DataTable.Cell> 
        <DataTable.Cell>{findParkingDataById('Lot C')}/{OccupancyCMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(findParkingDataById('Lot C'),OccupancyCMax)} ></DataTable.Cell>   
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot F</DataTable.Cell> 
        <DataTable.Cell>{findParkingDataById('Lot F')}/{OccupancyFMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(findParkingDataById('Lot F'),OccupancyFMax)} ></DataTable.Cell>  
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot K</DataTable.Cell> 
        <DataTable.Cell>{findParkingDataById('Lot K')}/{OccupancyKMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(findParkingDataById('Lot K'),OccupancyKMax)} ></DataTable.Cell> 
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot XYZ</DataTable.Cell> 
        <DataTable.Cell>{findParkingDataById('Lot XYZ')}/{OccupancyXYZMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(findParkingDataById('Lot XYZ'),OccupancyXYZMax)} ></DataTable.Cell> 
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot PS1</DataTable.Cell> 
        <DataTable.Cell>{findParkingDataById('Lot PS1')}/{OccupancyPS1Max}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(findParkingDataById('Lot PS1'),OccupancyPS1Max)} ></DataTable.Cell> 
      </DataTable.Row> 
    </DataTable> 

  ); 
}; 
  
export default Table; 
  
const styles = StyleSheet.create({ 
  container: { 
    padding: 15,     
  }, 
  tableHeader: { 
    backgroundColor: '#DCDCDC', 
  }, 
  row : {
    padding: 5,
  },
});