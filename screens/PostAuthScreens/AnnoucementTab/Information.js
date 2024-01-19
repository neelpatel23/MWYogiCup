import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

const InformationScreen = () => {
  const [information, setInformation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInformationFromFirestore = async () => {
      setLoading(true);

      const informationCollectionRef = collection(database, 'informationDATA');
      const querySnapshot = await getDocs(informationCollectionRef);

      const informationData = [];
      querySnapshot.forEach((doc) => {
        informationData.push({ id: doc.id, ...doc.data() });
      });

      // Sort the information data by the 'id' field
      informationData.sort((a, b) => a.id - b.id);

      setInformation(informationData);
      setLoading(false);
    };

    fetchInformationFromFirestore();
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
      {information.map((info, index) => (
        <Card key={index} style={styles.card}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'cursive-font', fontSize: 16, padding: 10, marginLeft: 5 }}>
                {info.title}
            </Text>
          </View>
          <View style={styles.divider} />
          <Card.Content>
            <Paragraph>{info.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginVertical: 5,
    },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add any other styles you need
});

export default InformationScreen;
