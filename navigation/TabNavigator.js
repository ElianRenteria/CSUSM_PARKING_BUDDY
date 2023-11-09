import React, { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AnnouncementsStackNavigator } from "./StackNavigator";
import { ParkingMapStackNavigator } from "./StackNavigator";
import { PreferencesStackNavigator } from "./StackNavigator";
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ColorSchemeContext } from "../screens/ColorSchemeContext";

const Tab = createBottomTabNavigator();

const screenOptionStyle = (route, colorScheme) => ({
    tabBarStyle: [{ backgroundColor: colorScheme === 'dark' ? '#282828' : '#FFFFFF' }],
    headerStyle: { backgroundColor: colorScheme === 'dark' ? '#282828' : '#FFFFFF' },
    headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#282828',
    // tabBarIcon: ({ focused, color, size }) => {
    //     const colorFocused = focused ? '#007AC3' : 'grey';
    //     let iconName;
    //     if (route.name === 'Announcements') {
    //         iconName = 'announcement';
    //         return <MaterialIcons name={iconName} size={24} color={colorFocused} />;
    //     } else if (route.name === 'Preferences') {
    //         iconName = 'account-cog-outline';
    //         return <MaterialCommunityIcons name={iconName} size={24} color={colorFocused} />;
    //     } else if (route.name === 'Parking Map') {
    //         iconName = 'map-o';
    //         return <FontAwesome name={iconName} size={24} color={colorFocused} />;
    //     }
    // }
})

const BottomTabNavigator = ({ route }) => {
    const { colorScheme } = useContext(ColorSchemeContext);

    return (
        <Tab.Navigator screenOptions={screenOptionStyle(route, colorScheme)}>
            <Tab.Screen name="Announcements" component={AnnouncementsStackNavigator} />
            <Tab.Screen name="Parking Map" component={ParkingMapStackNavigator} onPress={() => getLocation()} />
            <Tab.Screen name="Preferences" component={PreferencesStackNavigator} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
