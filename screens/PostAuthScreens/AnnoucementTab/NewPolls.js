import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Button, Text, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { auth, database } from '../../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import colors from '../../../globalVariables/colors';

const NewPolls = ({ navigation }) => {
  console.log(navigation)
  const [title, setTitle] = useState('');
  const [choices, setChoices] = useState(['', '']); // Initial choices array with two empty strings

  // Function to handle adding a new choice input field
  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  // Function to handle updating a choice value
  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  // Function to handle saving the new poll
  const handleSavePoll = async () => {
    if (title.trim() === '' || choices.some(choice => choice.trim() === '')) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Add the poll document to Firestore
      const pollRef = await addDoc(collection(database, 'pollsDATA'), {
        title,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
      });

      // Add choices to the subcollection 'choices' within the poll document
      for (const choice of choices) {
        await addDoc(collection(pollRef, 'choices'), { value: choice });
      }

      Alert.alert('Success', 'Poll created successfully');
      setTitle('');
      setChoices(['', '']); // Reset choices to two empty strings
    } catch (error) {
      console.error('Error adding poll: ', error);
      Alert.alert('Error', 'Could not save the poll');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            placeholder="Poll Title"
            value={title}
            onChangeText={setTitle}
          />
          {/* Render input fields for choices */}
          {choices.map((choice, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Choice ${index + 1}`}
              value={choice}
              onChangeText={(value) => handleChoiceChange(index, value)}
            />
          ))}
          {/* Button to add a new choice */}
          <Button title="Add Choice" onPress={handleAddChoice} color={colors.primary} />
          {/* Button to save the poll */}
          <Button
            title="Save Poll"
            onPress={handleSavePoll}
            color={colors.primary}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    padding: 10,
    margin: 10,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
});

export default NewPolls;
