import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { ref as storageRef, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, database, auth } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const MyReels = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const user = auth.currentUser;
        const q = query(collection(database, 'reels'), where("metadata.customMetadata.uploader", "==", user.displayName));
        const querySnapshot = await getDocs(q);

        const imageList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          url: doc.data().url,
        }));

        setImages(imageList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const deleteImage = async (imageId, imageUrl) => {
    try {
      const imageRef = storageRef(storage, imageUrl);
      await deleteObject(imageRef);
  
      // Delete the image metadata from Firestore
      await deleteDoc(doc(database, 'reels', imageId));
  
      // Update the images state to reflect the deletion
      setImages(images.filter(image => image.id !== imageId));
  
      // Show success message
      Alert.alert('Success', 'Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete image.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : images.length > 0 ? (
        images.map(image => (
          <View style={styles.imageContainer} key={image.id}>
            <Image source={{ uri: image.url }} style={styles.image} />
            <TouchableOpacity onPress={() => deleteImage(image.id, image.url)} style={styles.deleteButton}>
              <Icon name="trash-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noImagesText}>You have no posts</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yogiCupBlue,
    padding: 10,
  },
  imageContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default MyReels;
