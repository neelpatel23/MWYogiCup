import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../globalVariables/colors';
import { database } from '../../../config/firebase';
const logo = require("../../../assets/logo1.png");

const FeedScreen = ({ navigation }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploaderNames, setUploaderNames] = useState([]);
  const [uploaderCenters, setUploaderCenters] = useState([]);
  const [uploaderGroups, setUploaderGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("My Reels")}>
          <Icon name="person-outline" size={30} color={colors.primary} style={styles.iconStyle} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        let q = collection(database, 'reels');
        let modifiedSearchTerm = searchTerm.trim().toLowerCase(); // Convert search term to lowercase
  
        if (modifiedSearchTerm !== '') {
          // Search for matching documents if searchTerm is not empty
          const querySnapshot = await getDocs(q);
          const matchingDocs = querySnapshot.docs.filter(doc => {
            const uploaderName = doc.data().metadata.customMetadata.uploader.toLowerCase(); // Convert uploader name to lowercase
            return uploaderName.includes(modifiedSearchTerm);
          });
  
          // Sort the matching documents based on the creation date (earliest to latest)
          const sortedDocs = matchingDocs.sort((a, b) => {
            const aCreatedAt = new Date(a.data().metadata.customMetadata.createdAt);
            const bCreatedAt = new Date(b.data().metadata.customMetadata.createdAt);
            return bCreatedAt - aCreatedAt;
          });
  
          const urls = sortedDocs.map(doc => doc.data().url);
          const names = sortedDocs.map(doc => doc.data().metadata.customMetadata.uploader);
          const centers = sortedDocs.map(doc => doc.data().metadata.customMetadata.center);
          const groups = sortedDocs.map(doc => doc.data().metadata.customMetadata.group);
          
          setImageUrls(urls);
          setUploaderCenters(centers);
          setUploaderNames(names);
          setUploaderGroups(groups);
          setLoading(false);
        } else {
          // If searchTerm is empty, load all pictures
          const querySnapshot = await getDocs(q);
          const sortedDocs = querySnapshot.docs.sort((a, b) => {
            const aCreatedAt = new Date(a.data().metadata.customMetadata.createdAt);
            const bCreatedAt = new Date(b.data().metadata.customMetadata.createdAt);
            return bCreatedAt - aCreatedAt;
          });
  
          const urls = sortedDocs.map(doc => doc.data().url);
          const names = sortedDocs.map(doc => doc.data().metadata.customMetadata.uploader);
          const centers = sortedDocs.map(doc => doc.data().metadata.customMetadata.center);
          const groups = sortedDocs.map(doc => doc.data().metadata.customMetadata.group);
          
          setImageUrls(urls);
          setUploaderCenters(centers);
          setUploaderNames(names);
          setUploaderGroups(groups);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching image URLs:', error);
        setLoading(false);
      }
    };    
      
    fetchImageUrls();
  }, [searchTerm]);  

  

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.searchInput}
          placeholder="Search by user's name"
          placeholderTextColor={'white'}
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : imageUrls.length > 0 ? (
        <>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {imageUrls.map((url, index) => (
            <View style={styles.slide} key={index}>
              {/* <Image source={{ uri: url }} style={styles.image} resizeMode="cover"  /> */}
              <Image source={{ uri: url }} style={[styles.image, { height: height * 0.7}]} resizeMethod='resize' resizeMode='contain' /> 
              {/* <Text>Hey</Text> */}
              <View style={styles.overlay}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.metadata}>{uploaderNames[index] || 'N/A'} - {uploaderGroups[index] || 'N/A'} - {uploaderCenters[index] || 'N/A'} </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        </>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ color: 'white'}}>Your feed is empty.</Text>
        </View>
      )}
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.yogiCupBlue,
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    // marginBottom: 10,
    backgroundColor: 'transparent',
  },
  searchInput: {
    color: 'white',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  iconStyle: {
    marginRight: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Adjust this value if needed
  },
  slide: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    // height: '100%',
    aspectRatio: 16/9, // Aspect ratio for image
  },
  overlay: {
    justifyContent: 'center',
    alignContent: 'center',
    position: 'absolute',
    bottom: 10,
    // left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  metadata: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedScreen;
