import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, FAB } from 'react-native-paper';
import { auth, database } from '../../../config/firebase';
import { collection, query, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore';
import { TabView, TabBar } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../globalVariables/colors';
import InformationScreen from './Information';
import TransportationScreen from './Transportation';
import ContactScreen from './Contact';
import SuperlativePolls from './Polls';

const AnnouncementTab = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'announcement', icon: 'megaphone-outline' },
    { key: 'schedule', icon: 'calendar-outline' },
    { key: 'locations', icon: 'pin' },
    { key: 'contact', icon: 'call-outline' },
    { key: 'polls', icon: 'bar-chart-outline' }

  ]);  

  const fetchAnnouncements = async () => {
    try {
      const storedAnnouncements = await AsyncStorage.getItem('announcements');

      if (storedAnnouncements) {
        setAnnouncements(JSON.parse(storedAnnouncements));
      }

      const userRef = doc(database, 'userDATA', auth.currentUser.uid);
      getDoc(userRef).then(doc => {
        setIsAdmin(doc.exists() && doc.data().userRole === 'Admin');
      });

      const q = query(collection(database, 'announcements'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, snapshot => {
        const newAnnouncements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(newAnnouncements);
        AsyncStorage.setItem('announcements', JSON.stringify(newAnnouncements));  // Update AsyncStorage
        setLoading(false);  // Set loading to false after fetching announcements
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);  // Set loading to false in case of an error
    }
  };


  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const reloadAnnouncements = async () => {
    setLoading(true); // Set reloading to true to indicate reloading process
    // Wait for announcements to reload
    await fetchAnnouncements();
    setLoading(false); // Set reloading to false after announcements have been reloaded
  };
  

  useLayoutEffect(() => {
    const tabTitles = ['Announcements', 'Schedule', 'Locations', 'Contact', 'Polls'];
    navigation.setOptions({
      headerTitle: tabTitles[index] // Set the header title based on the active tab index
    });
  }, [navigation, index]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Account")}>
          <Icon name="person-outline" size={30} color={colors.primary} style={styles.iconStyle} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
                    <Text style={styles.paragraph}>Posted by {userName}</Text>

                  </Card.Content>
                </Card>
              ))
            ) : (
              <TouchableOpacity>
                <Text style={styles.noContentText}>
                  No announcements yet.
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        );
      case 'schedule':
        return <InformationScreen />
      case 'locations':
        return <TransportationScreen />
      case 'contact':
        return <ContactScreen />
      case 'polls':
        return <SuperlativePolls />
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }


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
      {index === 1 && ( // Index 0 corresponds to the Announcement tab
        <FAB
          color='white'
          style={styles.fab1}
          icon="food-outline"
          // label='Food'
          onPress={() => navigation.navigate("Food")}
        />
      )}
      {isAdmin && index === 0 && (
        <FAB
          style={styles.reloadButton}
          icon="reload"
          color='white'
          onPress={reloadAnnouncements}
        />
      )}
      {isAdmin && index === 0 && ( // Index 0 corresponds to the Announcement tab
        <FAB
          color='white'
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('NewAnnouncement')}
        />
      )}
      {isAdmin && index === 4 && ( // Index 0 corresponds to the Announcement tab
        <FAB
          color='white'
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('NewPolls')}
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
  reloadButton: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: colors.yogiCupBlue,
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
  fab1: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  iconStyle: {
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnnouncementTab;
