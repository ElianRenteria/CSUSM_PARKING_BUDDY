import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AnnouncementsScreen from "../screens/AnnouncementsScreen";
import ParkingMapScreen from "../screens/MapScreen";
import PreferencesScreen from "../screens/PreferencesScreen";

const Stack = createStackNavigator();

const screenOptionStyle = {
    headerStyle: {
        backgroundColor: "#9AC4F8",
    },
    headerTintColor: "white",
    headerBackTitle: "Back"
};

const AnnouncementsStackNavigator = () => {
    return (
        <Stack.Navigator options={screenOptionStyle}>
            <Stack.Screen name="Annoucements" component={AnnouncementsScreen} />
        </Stack.Navigator>
    );
}

const ParkingMapStackNavigator = () => {
    return (
        <Stack.Navigator options={screenOptionStyle}>
            <Stack.Screen name="Parking Map" component={ParkingMapScreen} />
        </Stack.Navigator>
    )
}

const PreferencesStackNavigator = () => {
    return (
        <Stack.Navigator options={screenOptionStyle}>
            <Stack.Screen name="Preferences" component={PreferencesScreen} />
        </Stack.Navigator>
    )
}

/*
async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync(); // Request location permissions

    if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const region = {
            latitude,
            longitude,
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034
        };
        console.log(latitude, longitude)
        map.current.animateToRegion(region, 500);
        return region;
    } else {
        // Handle permission denied or restricted case
    }
}
*/

export { AnnouncementsStackNavigator, ParkingMapStackNavigator, PreferencesStackNavigator };
