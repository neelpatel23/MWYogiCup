import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator, Image, SafeAreaView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth, database } from '../../../config/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, getDoc, collection, setDoc } from 'firebase/firestore'; // Import Firestore functions
import colors from '../../../globalVariables/colors';
const yogiCupLogo = require("../../../assets/logo1.png");

const ReelsScreen = ({navigation}) => {
  const cameraRef = useRef(null);
  const user = auth.currentUser;
  const [hasPermission, setHasPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [userData, setUserData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      const { gallery } = await ImagePicker.requestMediaLibraryPermissionsAsync(true);
      setGalleryPermission(gallery === 'granted');
    })();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(database, 'userDATA', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.uid]);

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
        if (photo) {
          compressAndSetImage(photo.uri);
        } else {
          throw new Error('Failed to capture a picture.');
        }
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
    if (!photoUri) {
      Alert.alert("Error", "No photo to upload.");
      return;
    }
  
    setIsUploading(true);
  
    try {
      const userDisplayName = user?.displayName || 'anonymous';
      const userUID = user?.uid;
      const fileName = `${Date.now()}.jpg`;
      const storagePath = `reels/${userDisplayName}/${fileName}`;
      const fileRef = storageRef(storage, storagePath);
      let blob;
  
      if (photoUri.startsWith('file://')) {
        const localFilePath = photoUri.substr(7);
        const compressedImage = await ImageManipulator.manipulateAsync(
          localFilePath,
          [],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        blob = await (await fetch(compressedImage.uri)).blob();
      } else {
        blob = await (await fetch(photoUri)).blob();
      }
  
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          'userUID': userUID,
          'uploader': userDisplayName,
          'center': userData.center,
          'group': userData.group,
          'createdAt': new Date().toISOString()
        },
      };
  
      await uploadBytes(fileRef, blob, metadata);
      const downloadURL = await getDownloadURL(fileRef);
      const reelsRef = collection(database, 'reels');
      const docRef = doc(reelsRef, fileName);
      await setDoc(docRef, { url: downloadURL, metadata });
  
      Alert.alert("Success", "Photo uploaded successfully!");
    } catch (error) {
      console.error("Upload Error: ", error);
      Alert.alert("Error", "Failed to upload the photo.");
    } finally {
      setIsUploading(false);
      setPhotoUri(null);
    }
  };
  

  const renderCameraView = () => {
    // Check if the platform is Android
    const isAndroid = Platform.OS === 'android';
  
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.iconContainer}>
          <View style={styles.logoContainer}>
            <Image source={yogiCupLogo} style={{ width: 50, height: 50 }} />
            <Text style={{ color: 'white', marginLeft: 20, fontSize: 25, fontWeight: '200' }}>Reels</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("My Feed")}>
            <Icon name="albums-outline" size={30} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
        {isAndroid ? (
          // Adjustments for Android users
          <View style={styles.androidContainer}>
            {/* <Text style={styles.androidMessage}>
              Please upload from the gallery.
            </Text> */}
            <TouchableOpacity onPress={pickImageFromGallery} style={styles.galleryButtonAndroid}>
              <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
              <Icon name="image-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          // For non-Android users, show the full camera functionality
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
        )}
      </View>
    );
  };
  
  

  const renderPreviewView = () => (
    <View style={styles.preview}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} />
      <TouchableOpacity onPress={() => setPhotoUri(null)} style={styles.cancelButton}>
        <Icon name='reload-outline' size={25} color="white"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={uploadImage} style={styles.uploadButton}>
        <Icon name='paper-plane-outline' size={25} color="white"/>
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
  container1: {
    zIndex: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value (0.5 in this case)
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 30,
    zIndex: 1,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    top: 0,
    right: 0,
    marginLeft: 30,
  },
  preview: {
    backgroundColor: colors.primary,
    ...StyleSheet.hairlineWidth, // Make the camera preview full-screen
    flex: 1,
  },
  androidContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  androidMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    marginBottom: 20, // Add some space between the text and the button
  },
  galleryButtonAndroid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 50,
  },
  galleryButtonText: {
    color: 'white',
    marginRight: 10, // Space between text and icon
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    color: 'white',
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
    padding: 15,
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
    padding: 15,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
  },
});

export default ReelsScreen;
