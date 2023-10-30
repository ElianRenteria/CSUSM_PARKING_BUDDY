
import React from 'react'; 
import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 

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
        <DataTable.Cell>{OccupancyBCurrent}/{OccupancyBMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupancyBCurrent,OccupancyBMax)}></DataTable.Cell>  
      </DataTable.Row> 
  
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot C</DataTable.Cell> 
        <DataTable.Cell>{OccupancyCCurrent}/{OccupancyCMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupancyCCurrent,OccupancyCMax)} ></DataTable.Cell>   
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot F</DataTable.Cell> 
        <DataTable.Cell>{OccupancyFCurrent}/{OccupancyFMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupancyFCurrent,OccupancyFMax)} ></DataTable.Cell>  
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot K</DataTable.Cell> 
        <DataTable.Cell>{OccupancyKCurrent}/{OccupancyKMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupancyKCurrent,OccupancyKMax)} ></DataTable.Cell> 
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot XYZ</DataTable.Cell> 
        <DataTable.Cell>{OccupancyXYZCurrent}/{OccupancyXYZMax}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupancyXYZCurrent,OccupancyXYZMax)} ></DataTable.Cell> 
      </DataTable.Row> 
      <DataTable.Row style={styles.row}> 
        <DataTable.Cell>Lot PS1</DataTable.Cell> 
        <DataTable.Cell>{OccupancyPS1Current}/{OccupancyPS1Max}</DataTable.Cell> 
        <DataTable.Cell backgroundColor = {colorPick(OccupancyPS1Current,OccupancyPS1Max)} ></DataTable.Cell> 
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