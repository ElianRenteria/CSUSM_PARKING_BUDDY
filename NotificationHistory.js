// NotificationHistory.js

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

const NotificationHistory = ({ isVisible, onClose, notifications }) => {
    return (
        <Modal
            isVisible={isVisible}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            style={styles.modal}
            backdropOpacity={0.5}
            swipeDirection={['right']} // Allows user to swipe right to close
            onSwipeComplete={onClose}
            onBackdropPress={onClose} // Allows user to tap away to close
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Push Notifications</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" type="antdesign" />
                    </TouchableOpacity>
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
        </Modal>
    );
};

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

export default NotificationHistory;