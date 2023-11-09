import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const HistoricalNotifications = (notifications) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Push Notifications</Text>
                {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Icon name="close" type="antdesign" />
                </TouchableOpacity> */}
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.body}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        marginLeft: 10, // Adjust this value as needed for your layout
    },
    modal: {
        margin: 0, // This will stretch the modal to the entire screen width
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1, // This will stretch the container to the entire height of the modal
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    closeButton: {
        alignSelf: 'flex-start',
        padding: 10,
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontWeight: 'bold',
    },
});

export default HistoricalNotifications;