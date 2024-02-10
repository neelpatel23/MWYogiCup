import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../../../config/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import colors from '../../../globalVariables/colors';

const ReelsScreen = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      const { gallery } = ImagePicker.requestMediaLibraryPermissionsAsync(true);
      setGalleryPermission(status === 'granted');
    })();
  }, []);

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        compressAndSetImage(photo.uri);
      } catch (error) {
        console.error("Take Picture Error: ", error);
        Alert.alert("Error", "Failed to take a picture.");
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        // allowsMultipleSelection: true
      });
  
      if (!result.canceled) {
        compressAndSetImage(result.uri);
      }
    } catch (error) {
      console.error("Gallery Pick Error: ", error);
      Alert.alert("Error", "Failed to pick an image from the gallery.");
    }
  };

  const compressAndSetImage = async (uri) => {
    try {
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize the image to a width of 800 pixels
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPhotoUri(compressedImage.uri);  
    } catch (error) {
      console.error("Compression Error: ", error);
      Alert.alert("Error", "Failed to compress the image.");
    }
  };

  const uploadImage = async () => {
    if (!photoUri) return;
    setIsUploading(true);
    try {
      const userDisplayName = auth.currentUser?.displayName || 'anonymous';
      const fileName = `${Date.now()}.jpg`;
      const fileRef = storageRef(storage, `reels/${userDisplayName}/${fileName}`);
      const blob = await (await fetch(photoUri)).blob();
  
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          'uploader': userDisplayName
        },
      };
  
      // Upload the image
      await uploadBytes(fileRef, blob, metadata);
  
      // Get the public URL of the uploaded image
      const downloadURL = await getDownloadURL(fileRef);
  
      // Now you can use this downloadURL to display the image or store it for later use
      console.log("Download URL:", downloadURL);
  
      Alert.alert("Success", "Photo uploaded successfully!");
    } catch (error) {
      console.error("Upload Error: ", error);
      Alert.alert("Error", "Failed to upload the photo.");
    } finally {
      setIsUploading(false);
      setPhotoUri(null);
    }
  };
  

  const renderCameraView = () => (
    <>
      <Camera ref={cameraRef} type={type} style={styles.preview} />
      <View style={styles.snapButtonContainer}>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          <Icon name='camera-outline' size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={flipCamera} style={styles.flipButton}>
          <Icon name="camera-reverse-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImageFromGallery} style={styles.galleryButton}>
          <Icon name="image-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPreviewView = () => (
    <View style={styles.preview}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} />
      <TouchableOpacity onPress={() => setPhotoUri(null)} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Retake</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={uploadImage} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.uploadingText}>Something went wrong</Text>
        <Text style={styles.uploadingText}>Contact Developer for more assistance</Text>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
    <View style={styles.loadingContainer}>
      <Text style={styles.uploadingText}>No Access to camera</Text>
      <Text style={styles.uploadingText}>Contact Developer for more assistance</Text>
    </View>
    )
  }

  return (
    <View style={styles.container}>
      {isUploading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      ) : photoUri ? renderPreviewView() : renderCameraView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value (0.5 in this case)
  },
  
  preview: {
    backgroundColor: colors.primary,
    ...StyleSheet.hairlineWidth, // Make the camera preview full-screen
    flex: 1,
  },
  capture: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    margin: 20,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 95,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  snapButtonContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  flipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#fff',
  },
  uploadButton: {
    position: 'absolute',
    color: 'white',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
  },
});

export default ReelsScreen;
