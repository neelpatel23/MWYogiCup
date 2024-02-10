// AllStarVoting.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AllStarVoting = () => {
  const [users, setUsers] = useState([]);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');

  const usersRef = collection(database, 'userDATA');
  const votesRef = collection(database, 'allStarVotesDATA');

  // Fetch users from Firestore based on the selected group
  useEffect(() => {
    let unsubscribeUsers;

    if (selectedGroup) {
      const groupQuery = query(usersRef, where('group', '==', selectedGroup));
      unsubscribeUsers = onSnapshot(groupQuery, (querySnapshot) => {
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setLoading(false);
      });
    } else {
      // If no group is selected, fetch all users
      unsubscribeUsers = onSnapshot(usersRef, (querySnapshot) => {
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setLoading(false);
      });
    }

    return () => unsubscribeUsers();
  }, [selectedGroup]);

  // Fetch votes from Firestore
  useEffect(() => {
    const unsubscribeVotes = onSnapshot(votesRef, (querySnapshot) => {
      const votesData = {};
      querySnapshot.forEach(doc => {
        votesData[doc.id] = doc.data();
      });
      setVotes(votesData);
    });

    return () => unsubscribeVotes();
  }, []);

  // Create a votes document for each user if it doesn't exist
  useEffect(() => {
    users.forEach(async (user) => {
      const userVotesRef = doc(votesRef, user.id);
      const userVotesSnapshot = await getDoc(userVotesRef);

      if (!userVotesSnapshot.exists()) {
        await setDoc(userVotesRef, { count: 0 });
      }
    });
  }, [users]);

  // Vote handler with limitations
  const handleVote = async (userId, type) => {
    const userVotesRef = doc(votesRef, userId);
    const currentVotesSnapshot = await getDoc(userVotesRef);
    const currentVotes = currentVotesSnapshot.exists() ? currentVotesSnapshot.data().count : 0;

    if (type === 'upvote') {
      // Limit to one vote
      if (currentVotes === 0) {
        await updateDoc(userVotesRef, { count: currentVotes + 1 });
      }
    } else if (type === 'downvote') {
      // Limit to zero or above
      if (currentVotes > 0) {
        await updateDoc(userVotesRef, { count: currentVotes - 1 });
      }
    }
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Radio buttons for selecting the group */}
      <View style={styles.radioContainer}>
        {['K1', 'K2', 'YM'].map((group) => (
          <TouchableOpacity
            key={group}
            style={[
              styles.radioButton,
              { backgroundColor: group === selectedGroup ? colors.primary : 'white' },
            ]}
            onPress={() => setSelectedGroup(group)}
          >
            <Text style={{ color: group === selectedGroup ? 'white' : colors.primary }}>
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
  
      <ScrollView>
        {users
          .sort((a, b) => (votes[b.id]?.count || 0) - (votes[a.id]?.count || 0))
          .map(user => (
            <Card key={user.id} style={styles.userCard}>
              <Card.Content>
                <Title>{user.firstName}</Title>
                <Paragraph>Group: {user.group}</Paragraph>
                <Paragraph>Center: {user.center}</Paragraph>
                <Paragraph>Upvotes: {votes[user.id]?.count || 0}</Paragraph>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleVote(user.id, 'upvote')}>
                    <Icon name="plus" size={30} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleVote(user.id, 'downvote')}>
                    <Icon name="minus" size={30} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          ))}
      </ScrollView>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userCard: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
});

export default AllStarVoting;
