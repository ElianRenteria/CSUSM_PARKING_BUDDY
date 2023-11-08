import React, { useRef, useEffect, useState, useContext } from 'react';
import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 
import firebase from '../firebase/firebaseConfig';

OccupancyBMax = 493;
OccupancyCMax = 535;
OccupancyFMax = 1288;
OccupancyKMax = 178;
OccupancyXYZMax = 816;
OccupancyPS1Max = 1419;

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

const findParkingDataById = (documentId) => {
  const parkingDataItem = parkingData.find((item) => item.id === documentId);
  return parkingDataItem ? parkingDataItem.occupation : null;
};

useEffect(() => {
  // Reference to the "Parking Spaces" collection
  const parkingRef = firebase.firestore().collection('Parking Structure');

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

  
  return ( 
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