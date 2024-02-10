import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';

const FeedScreen = () => {
  const [photoData, setPhotoData] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch the list of files from BunnyCDN
    const storageZoneName = 'neelpatel';
    const path = 'neelpatel';
    const apiKey = 'f505a918-c4e6-4b37-b2f6a5765ede-ad21-4480'; // Replace with your actual API key
  
    const options = {
        method: 'GET',
        url: `https://ny.storage.bunnycdn.com/mwyogicup/`,
        headers: {accept: 'application/json', accesskey: apiKey}
    };

    axios
    .request(options)
    .then(function (response) {
        setPhotoData(response.data)
    })
    .catch(function (error) {
        console.error(error.response);
    });

  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePhotoPress(item)}>
      <Image source={{ uri: `https://ny.storage.bunnycdn.com${item.Path}${item.ObjectName}` }} style={styles.photoThumbnail} />
    </TouchableOpacity>
  );
  

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const renderModalContent = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Image source={{ uri: selectedPhoto?.url }} style={styles.fullscreenImage} />
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={photoData}
        renderItem={renderItem}
        keyExtractor={(item) => item.Guid} // Assuming Guid is a unique identifier
        numColumns={3}
        contentContainerStyle={styles.flatListContainer}
        />
      {renderModalContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContainer: {
    padding: 8,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    margin: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullscreenImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FeedScreen;
