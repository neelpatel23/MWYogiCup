import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import colors from '../../../globalVariables/colors';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';

const InformationScreen = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const fetchScheduleFromFirestore = async () => {
      const scheduleCollectionRef = collection(database, 'scheduleDATA');
      const querySnapshot = await getDocs(scheduleCollectionRef);

      const scheduleData = [];
      querySnapshot.forEach((doc) => {
        scheduleData.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched schedule data:', scheduleData); // Log the fetched data

      setScheduleData(scheduleData);
    };

    fetchScheduleFromFirestore();
  }, []);

  const handleDaySelection = (day) => {
    setSelectedDay(day);
  };

  return (
    <View style={styles.container}>
      <View style={styles.radioContainer}>
        {scheduleData.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.radioButton,
              { backgroundColor: day.id === selectedDay ? colors.primary : 'white' },
            ]}
            onPress={() => handleDaySelection(day.id)}
          >
            <Text style={{ color: day.id === selectedDay ? 'white' : colors.primary }}>
              {day.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {selectedDay && (
          <View>
            {/* <Text style={styles.dayTitle}>{selectedDay}</Text> */}
            {scheduleData
              .find((day) => day.id === selectedDay)
              ?.events.map((event, index) => (
                <Card key={index} style={styles.card}>
                  <Card.Content>
                    <Paragraph>Description: {event.title}</Paragraph>
                    <Paragraph>Description: {event.description}</Paragraph>
                    <Paragraph>Time: {event.time}</Paragraph>
                  </Card.Content>
                </Card>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  radioContainer: {
    width: '100%', // Take full width of the screen
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // radioButton: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 8,
  //   paddingHorizontal: 16,
  //   margin: 5,
  //   borderWidth: 1,
  //   borderColor: colors.primary,
  //   borderRadius: 8,
  // },

  radioButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    paddingVertical: 6, // Adjust the padding vertically
    paddingHorizontal: 12, // Adjust the padding horizontally
    marginHorizontal: 4,
    marginVertical: 4, // Add margin vertically between age groups
    borderWidth: 1,
    marginBottom: 5,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  dayTitle: {
    fontFamily: 'cursive-font',
    fontSize: 16,
    padding: 10,
    marginLeft: 5,
    marginBottom: 5,
  },
  card: {
    marginVertical: 8,
    elevation: 4,
  },
});

export default InformationScreen;
