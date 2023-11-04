import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import firebase from '../firebase/firebaseConfig';

const UserReportScreen = () => {
    console.log('UserReportScreen rendered');
    const [occupancyLevel, setOccupancyLevel] = useState('1');
    const [parkingLot, setParkingLot] = useState('F');
    const [showPicker, setShowPicker] = useState(false);
    const togglePicker = () => {
        setShowPicker(!showPicker);
    }

    const ParkingReportState = () => {
        const [parkingLot, setParkingLot] = useState('');
        const [parkingSpace, setParkingSpace] = useState('');
        const [occupancyLevel, setOccupancyLevel] = useState('');
        const [comments, setComments] = useState('');

        /*const processSubmit = () => {
            const userreports = firebase.firestore().collection('ParkingReports');
            userreports.add({
                StructureID: parkingLot,
                SpaceID: parkingSpace,
                OccupancyLevel: occupancyLevel,
                ReportText: comments
            })
                .then(() => {
                    console.log('Submitted report');
                })
                .catch(error => {
                    console.error('report error: ', error);
                });
        };*/

        return (
            console.log('UserReportScreen rendered'),
            <View style={styles.container}>
                <Text>User Report</Text>
                <Text>Report Screen</Text> {/* Added message */}

                <TouchableOpacity style={styles.pickerContainer} onPress={togglePicker}>
                    <Text>{`Select Parking Lot: ${parkingLot}`}</Text>
                    {showPicker && (
                        <Picker
                            selectedValue={parkingLot}
                            onValueChange={(itemValue, itemIndex) => {
                                setParkingLot(itemValue);
                                togglePicker();
                            }}
                        >
                            <Picker.Item label="A" value="A" />
                            <Picker.Item label="B" SSvalue="B" />
                            <Picker.Item label="C" value="C" />
                            <Picker.Item label="D" value="D" />
                            <Picker.Item label="E" value="E" />
                        </Picker>
                    )}
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Parking Space"
                    value={parkingSpace}
                    onChangeText={text => setParkingSpace(text)}
                />
                <TouchableOpacity style={styles.pickerContainer} onPress={() => togglePicker()}>
                    <Text>{`Select Occupancy Level: ${occupancyLevel}`}</Text>
                    {showPicker && (
                        <Picker
                            selectedValue={occupancyLevel}
                            onValueChange={(itemValue, itemIndex) => {
                                setOccupancyLevel(itemValue);
                                togglePicker();
                            }}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    )}
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Comments"
                    value={comments}
                    onChangeText={text => setComments(text)}
                />
                <Button
                    title="Submit"
                    onPress={() => { }} />
            </View>
        );

    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
        },
        input: {
            width: '100%',
            height: 40,
            marginVertical: 10,
            paddingHorizontal: 10,
            borderColor: 'gray',
            borderWidth: 1,
        },
        pickerContainer: {
            width: '80%',
            borderWidth: 1,
            borderColor: 'blue',
            borderRadius: 5,
            marginVertical: 10,
        },
    });
};
export default UserReportScreen;