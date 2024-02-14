// Import necessary modules
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Linking, FlatList, Image, Platform, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

// Contact Card Component
const ContactCard = ({ contact }) => {
  const makeCall = (phone) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }
    Linking.openURL(phoneNumber);
  };

  const sendMessage = (phone) => {
    const smsURL = `sms:${phone}`;
    Linking.openURL(smsURL);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Image source={{ uri: contact.image }} style={styles.image} />
          <Title style={{ color: 'black', fontWeight: 'bold'}}>{contact.name}</Title>
        </View>
        <Paragraph style={{ color: 'black'}}>{contact.phone}</Paragraph>
        <Paragraph style={{ color: 'black'}}>{contact.email}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button 
          icon="phone" 
          mode="contained" 
          onPress={() => makeCall(contact.phone)}
          style={styles.button}
        >
          Call
        </Button>
        <Button 
          icon="message" 
          mode="contained" 
          onPress={() => sendMessage(contact.phone)}
          style={styles.button}
        >
          Message
        </Button>
      </Card.Actions>
    </Card>
  );
};

// Main Contact Screen Component
const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactDataFromFirestore = async () => {
      setLoading(true);

      const contactCollectionRef = collection(database, 'contactDATA');
      const querySnapshot = await getDocs(contactCollectionRef);

      const contactData = [];
      querySnapshot.forEach((doc) => {
        contactData.push({ id: doc.id, ...doc.data() });
      });

      // Sort the information data by the 'id' field
      contactData.sort((a, b) => a.id - b.id);

      setContacts(contactData);
      setLoading(false);
    };

    fetchContactDataFromFirestore();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={({ item }) => <ContactCard contact={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.yogiCupBlue
  },
  card: {
    borderWidth: 1,
    // borderColor: colors.primary,
    marginVertical: 8,
    // elevation: 4,
    backgroundColor: colors.cardBg
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  button: {
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactScreen;
