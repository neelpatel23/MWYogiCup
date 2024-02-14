import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Button, Text, Alert, FlatList } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { auth, database } from '../../../config/firebase';
import { collection, addDoc, doc, getDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import colors from '../../../globalVariables/colors';

const NewAnnouncement = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [previousAnnouncements, setPreviousAnnouncements] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userRef = doc(database, 'userDATA', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserFirstName(docSnap.data().firstName);
        setUserRole(docSnap.data().userRole);
      }
    };

    fetchUserInfo();

    const q = query(collection(database, 'announcements'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPreviousAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const handleSaveAnnouncement = async () => {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(database, 'announcements'), {
        title,
        content,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        userName: userFirstName,
        userRole
      });
      Alert.alert('Success', 'Announcement created successfully');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Could not save the announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    await deleteDoc(doc(database, 'announcements', announcementId));
    Alert.alert('Success', 'Announcement deleted successfully');
    setPreviousAnnouncements(previous => previous.filter(item => item.id !== announcementId));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            autoCorrect={false}
            style={styles.input}
            placeholder="Title"
            value={title}
            placeholderTextColor={colors.primary}
            onChangeText={setTitle}
          />
          <TextInput
            autoCorrect={false}
            style={[styles.input, styles.textArea]}
            placeholder="Content"
            value={content}
            placeholderTextColor={colors.primary}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
          />
          <Button
            title="Save Announcement"
            onPress={handleSaveAnnouncement}
            color={colors.primary}
          />
        </Card.Content>
      </Card>

      <Text style={styles.previousAnnouncementsTitle}>Previous Announcements</Text>
      <FlatList
        data={previousAnnouncements}
        renderItem={({ item }) => (
          <Card style={styles.previousAnnouncementCard}>
            {/* <Card.Title title={item.title} subtitle={`Posted on: ${item.createdAt.toDate().toLocaleString()} by ${item.userName}`} /> */}
            <Card.Content> 
              <Text style={{ fontSize: 20, paddingBottom: 5}}>{item.title}</Text>
              <Text style={{ fontSize: 18, paddingBottom: 10}}>{item.content}</Text>
              <Text style={{ fontSize: 15, paddingBottom: 5}}>{`Posted on: ${item.createdAt.toDate().toLocaleString()} by ${item.userName}`} </Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="delete"
                color="#f44336"
                onPress={() => handleDeleteAnnouncement(item.id)}
              />
            </Card.Actions>
          </Card>
        )}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.yogiCupBlue,
  },
  card: {
    backgroundColor: colors.yogiCupBlue,
    padding: 10,
    margin: 10,
    elevation: 3,
  },
  input: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  previousAnnouncementsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  previousAnnouncementCard: {
    margin: 10,
    elevation: 2,
  },
});

export default NewAnnouncement;
