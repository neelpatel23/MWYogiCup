import React, { useState, useEffect } from 'react';
import { View, Platform, Linking, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon library


const openMaps = (lat, lng) => {
  const url = Platform.select({
    ios: `maps:0,0?q=${lat},${lng}`,
    android: `geo:${lat},${lng}?q=${lat},${lng}`
  });

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
};



const LocationCard = ({ location }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Title>{location.name}</Title>
      <Paragraph>{location.description}</Paragraph>
    </Card.Content>
    <Card.Actions style={styles.cardActions}>
      <TouchableOpacity
        style={styles.directionIcon}
        onPress={() => openMaps(location.lat, location.lng)}
      >
        <Icon name="directions" size={30} color={colors.primary} />
      </TouchableOpacity>
    </Card.Actions>
  </Card>
);

const TransportationScreen = () => {
  const [transportation, setTransportaton] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransportationFromFirestore = async () => {
      setLoading(true);

      const transportationCollectionRef = collection(database, 'transportationDATA');
      const querySnapshot = await getDocs(transportationCollectionRef);

      const transportationData = [];
      querySnapshot.forEach((doc) => {
        transportationData.push({ id: doc.id, ...doc.data() });
      });

      // Sort the information data by the 'id' field
      transportationData.sort((a, b) => a.id - b.id);

      setTransportaton(transportationData);
      setLoading(false);
    };

    fetchTransportationFromFirestore();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {transportation.map((info, index) => (
        <LocationCard key={index} location={info} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  directionIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    marginRight: 0, 
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  cardActions: {
    justifyContent: 'flex-end', // Aligns children (icon) to the right
    alignItems: 'center',       // Centers children vertically
    height: 50,                 // Adjust the height as needed
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransportationScreen;
