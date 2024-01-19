import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB } from 'react-native-paper';
import { auth, database } from '../../../config/firebase';
import { collection, query, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore';
import { TabView, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../globalVariables/colors';
import InformationScreen from './Information';
import TransportationScreen from './Transportation';
import ContactScreen from './Contact';

const AnnouncementTab = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'announcement', icon: 'megaphone-outline' },
    { key: 'information', icon: 'information-circle-outline' },
    { key: 'transportation', icon: 'bus-outline' },
    { key: 'contact', icon: 'call-outline' }
  ]);  

  useEffect(() => {
    const userRef = doc(database, 'users', auth.currentUser.uid);
    getDoc(userRef).then(doc => {
      setIsAdmin(doc.exists() && doc.data().role === 'admin');
    });

    const q = query(collection(database, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    const tabTitles = ['Announcements', 'Information', 'Transportation', 'Contact'];
    navigation.setOptions({
      headerTitle: tabTitles[index] // Set the header title based on the active tab index
    });
  }, [navigation, index]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'announcement':
        return (
          <ScrollView style={styles.scene}>
            {announcements.length > 0 ? (
              announcements.map(({ id, title, content, createdAt, userName }) => (
                <Card key={id} style={styles.card}>
                  <Card.Content>
                    <Title style={styles.title}>{title}</Title>
                    <Paragraph style={styles.paragraph}>{content}</Paragraph>
                    <Text style={styles.metaText}>Posted by {userName} on {formatDate(createdAt)}</Text>

                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={styles.noContentText}>No announcements yet.</Text>
            )}
          </ScrollView>
        );
      case 'information':
        return <InformationScreen />
      case 'transportation':
        return <TransportationScreen />
      case 'contact':
        return <ContactScreen />
      default:
        return null;
    }
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={props => (
          <TabBar 
            {...props}
            style={styles.tabBar}
            renderIcon={({ route, focused, color }) => (
              <Icon name={route.icon} size={20} color={focused ? colors.primary : 'darkgray'} />
            )}
            indicatorStyle={styles.tabIndicator}
            renderLabel={() => null} // Hide labels
          />
        )}
      />
      {isAdmin && index === 0 && ( // Index 0 corresponds to the Announcement tab
        <FAB
          color='white'
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('NewAnnouncement')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scene: {
    flex: 1,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 14,
    color: '#666',
  },
  noContentText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  tabBar: {
    backgroundColor: '#f0f0f0',
    elevation: 0,
  },
  tabLabel: {
    color: 'black',
    fontSize: 8,
    padding: 0,
    margin: 0
  },
  tabIndicator: {
    backgroundColor: colors.primary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default AnnouncementTab;
