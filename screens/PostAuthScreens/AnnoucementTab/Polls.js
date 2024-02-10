import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Card, Title, FAB, IconButton, Button } from 'react-native-paper';
import NewPolls from './NewPolls'; // Import the NewPolls component
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

const Polls = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  // Function to fetch polls and user choices
  const fetchPollsAndUserChoices = async () => {
    try {
      // Fetch polls data
      const pollsRef = collection(database, 'pollsDATA');
      const pollsSnapshot = await getDocs(pollsRef);
      const fetchedPolls = [];

      await Promise.all(pollsSnapshot.docs.map(async pollDoc => {
        const poll = pollDoc.data();
        const choicesSnapshot = await getDocs(collection(pollDoc.ref, 'choices'));
        const choicesData = choicesSnapshot.docs.map(choiceDoc => choiceDoc.data().value);

        fetchedPolls.push({
          id: pollDoc.id,
          ...poll,
          choices: choicesData,
        });
      }));

      // Set fetched polls data
      setPolls(fetchedPolls);
      setLoading(false);
      // Fetch user choices
      fetchUserChoices();
      // Check if user is admin
      getAdminStatus();
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Function to fetch user choices
  const fetchUserChoices = async () => {
    try {
      const userChoicesRef = doc(database, 'userChoicesDATA', auth.currentUser.uid);
      const userChoicesSnapshot = await getDoc(userChoicesRef);
      const userChoicesData = userChoicesSnapshot.exists() ? userChoicesSnapshot.data() : {};

      // If user choices document doesn't exist, create it
      if (!userChoicesSnapshot.exists()) {
        await setDoc(userChoicesRef, {});
      }

      // Update polls with user choices
      setPolls(prevPolls => {
        return prevPolls.map(poll => {
          const userChoice = userChoicesData[poll.id];
          return { ...poll, userChoice: userChoice };
        });
      });
    } catch (error) {
      console.error('Error fetching user choices:', error);
    }
  };

  // Function to check if user is admin
  const getAdminStatus = async () => {
    const userRef = doc(database, 'userDATA', auth.currentUser.uid);
    getDoc(userRef).then(doc => {
      setIsAdmin(doc.exists() && doc.data().userRole === 'Admin');
    });
  };

  useEffect(() => {
    // Fetch polls and user choices on component mount
    fetchPollsAndUserChoices();
  }, []);

  // Function to handle selecting a choice for a poll
  const handleChoiceSelect = async (pollId, choiceIndex) => {
    try {
      const userChoice = polls.find(poll => poll.id === pollId)?.choices[choiceIndex];
      if (userChoice) {
        // If user already made a choice, do nothing
        if (polls.find(poll => poll.id === pollId)?.userChoice !== undefined) {
          return;
        }

        // Update the user's selected choice in Firestore
        const userChoicesRef = doc(database, 'userChoicesDATA', auth.currentUser.uid);
        await updateDoc(userChoicesRef, { [pollId]: userChoice });
        setPolls(prevPolls => {
          return prevPolls.map(poll => {
            if (poll.id === pollId) {
              return { ...poll, userChoice: userChoice };
            } else {
              return poll;
            }
          });
        });

        // Increment the vote count for the selected choice in totalVotesPollsDATA
        const totalVotesRef = doc(database, 'totalVotesPollsDATA', pollId);
        const totalVotesSnapshot = await getDoc(totalVotesRef);
        const choiceKey = `choice_${choiceIndex}`;
        if (totalVotesSnapshot.exists()) {
          // If the poll already exists in totalVotesPollsDATA
          const existingData = totalVotesSnapshot.data();
          const updatedData = {
            ...existingData,
            [choiceKey]: (existingData[choiceKey] || 0) + 1
          };
          await updateDoc(totalVotesRef, updatedData);
        } else {
          // If the poll does not exist in totalVotesPollsDATA, create it
          const newData = {
            [choiceKey]: 1
          };
          await setDoc(totalVotesRef, newData);
        }
      }
    } catch (error) {
      console.error('Error selecting choice:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : polls.length === 0 ? (
          <Text style={styles.noPollsText}>No polls exist. Check back later.</Text>
        ) : (
          polls.map(poll => (
            <View key={poll.id}>
              <Card style={styles.card}>
                <Card.Content>
                  <Title style={styles.title}>{poll.title}</Title>
                  {poll.choices.map((choice, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleChoiceSelect(poll.id, index)}
                      disabled={poll.userChoice !== undefined}
                      style={[
                        styles.choiceButton,
                        poll.userChoice !== undefined && {
                          backgroundColor: poll.userChoice === choice ? colors.primary : colors.disabledButton
                        }
                      ]}
                    >
                      <Text style={styles.choiceText}>{choice}</Text>
                      {poll.userChoice === choice && <Text style={styles.checkIcon}>✔️</Text>}
                    </TouchableOpacity>
                  ))}
                </Card.Content>
              </Card>
            </View>
          ))
        )}
      </ScrollView>
      {/* FAB to open the modal */}
      {/* Reload button */}
      <FAB
        style={styles.reloadButton}
        icon="reload"
        color='white'
        onPress={fetchPollsAndUserChoices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 20,
  },
  choiceButton: {
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.universalBg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  choiceText: {
    color: colors.white,
    fontSize: 16,
  },
  checkIcon: {
    color: colors.white,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  reloadButton: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: colors.yogiCupBlue,
  },
  noPollsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Polls;
