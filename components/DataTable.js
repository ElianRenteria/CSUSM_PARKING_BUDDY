import React from 'react'; 
import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 

/*var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/u/0/project/parkingbuddy-79e1c/firestore/data/~2FParking%20Structure~2FLot%20F"
});

const db = admin.firestore();*/


OccupancyBCurrent = 200;
OccupancyCCurrent = 400;
OccupancyFCurrent = 12;
OccupancyKCurrent = 160;
OccupancyXYZCurrent = 312;
OccupancyPS1Current = 1013;
OccupancyBMax = 493;
OccupancyCMax = 535;
OccupancyFMax = 1288;
OccupancyKMax = 178;
OccupancyXYZMax = 816;
OccupancyPS1Max = 1419;

OccupationDetermine = (Lot) =>{

  //when firebase works in expo use that instead of ifs:
  //const docRef = db.collection('Parking Structure').doc(Lot);
  //docRef.get()

  //occupation = doc.data()['OccupationCurrent']
  if (Lot == 'Lot B'){
    occupation = 150;
  }
  if (Lot == 'Lot C'){
    occupation = 400;
  }
  if (Lot == 'Lot F'){
    occupation = 643;
  }
  if (Lot == 'Lot K'){
    occupation = 20;
  }
  if (Lot == 'Lot XYZ'){
    occupation = 345;
  }
  if (Lot == 'Lot PS1'){
    occupation = 700;
  }

  return occupation
} 
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
  return ( 
    <DataTable style={styles.container}> 
      <DataTable.Header style={styles.tableHeader}> 
        <DataTable.Title>Parking Lot</DataTable.Title> 
        <DataTable.Title>Occupancy</DataTable.Title> 
        <DataTable.Title></DataTable.Title> 
      </DataTable.Header> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot B</DataTable.Cell> 
        <DataTable.Cell>{OccupationDetermine('Lot B')}/{OccupancyBMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupationDetermine('Lot B'),OccupancyBMax)}></DataTable.Cell>  
      </DataTable.Row> 
  
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot C</DataTable.Cell> 
        <DataTable.Cell>{OccupationDetermine('Lot C')}/{OccupancyCMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupationDetermine('Lot C'),OccupancyCMax)} ></DataTable.Cell>   
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot F</DataTable.Cell> 
        <DataTable.Cell>{OccupationDetermine('Lot F')}/{OccupancyFMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupationDetermine('Lot F'),OccupancyFMax)} ></DataTable.Cell>  
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot K</DataTable.Cell> 
        <DataTable.Cell>{OccupationDetermine('Lot K')}/{OccupancyKMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupationDetermine('Lot K'),OccupancyKMax)} ></DataTable.Cell> 
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot XYZ</DataTable.Cell> 
        <DataTable.Cell>{OccupationDetermine('Lot XYZ')}/{OccupancyXYZMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupationDetermine('Lot XYZ'),OccupancyXYZMax)} ></DataTable.Cell> 
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot PS1</DataTable.Cell> 
        <DataTable.Cell>{OccupationDetermine('Lot PS1')}/{OccupancyPS1Max}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupationDetermine('Lot PS1'),OccupancyPS1Max)} ></DataTable.Cell> 
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