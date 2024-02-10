import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import colors from '../../../globalVariables/colors';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';

const RegularSeason = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team names
        const teamNamesSnapshot = await getDocs(collection(database, 'teamNamesDATA'));
        const fetchedTeamNames = teamNamesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTeamNames(fetchedTeamNames);

        // Fetch schedules
        const schedulesSnapshot = await getDocs(collection(database, 'regularSeasonDATA'));
        const fetchedSchedules = schedulesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSchedules(fetchedSchedules);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderTeamNames = () => {
    if (!selectedAgeGroup) return null; // Don't render team names if no age group is selected

    const selectedTeamNames = teamNames.find(team => team.id === selectedAgeGroup)?.teams || [];

    return (
      <ScrollView horizontal={true} style={styles.teamNamesContainer}>
        {selectedTeamNames.map((teamName, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.radioButton,
              { backgroundColor: teamName === selectedTeam ? colors.primary : 'white' },
            ]}
            onPress={() => handleTeamSelect(teamName)}
          >
            <Text style={{ color: teamName === selectedTeam ? 'white' : colors.primary }}>
              {teamName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderSchedule = () => {
  
    if (!selectedAgeGroup || !schedules.find(schedule => schedule.id === selectedAgeGroup)) {
      return (
        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
          <Text>Select an age group to see their Schedule</Text>
        </View>
      );
    }
  
    const selectedSchedule = schedules.find(schedule => schedule.id === selectedAgeGroup);
    const filteredSchedules = selectedTeam
      ? selectedSchedule.games.filter(game => game.team1 === selectedTeam || game.team2 === selectedTeam)
      : selectedSchedule.games;

  
    return (
      <ScrollView>
        {filteredSchedules.map((game, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Text>{game.team1} vs {game.team2}</Text>
              <Title>{game.opponent}</Title>
              <Paragraph>Date: {game.date}</Paragraph>
              <Paragraph>Time: {game.time}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  };  

  const handleTeamSelect = (teamName) => {
    setSelectedTeam(prevState => prevState === teamName ? '' : teamName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ageGroupContainer}>
        {teamNames.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={[
              styles.radioButton,
              { backgroundColor: team.id === selectedAgeGroup ? colors.primary : 'white' },
            ]}
            onPress={() => setSelectedAgeGroup(prevState => prevState === team.id ? '' : team.id)}
          >
            <Text style={{ color: team.id === selectedAgeGroup ? 'white' : colors.primary }}>
              {team.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderTeamNames()}

      <View style={styles.scheduleContainer}>{renderSchedule()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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
  teamNamesContainer: {
    maxHeight: 40,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  ageGroupContainer: {
    width: '100%', // Take full width of the screen
    flexDirection: 'row',
    justifyContent: 'center', // Center the age groups horizontally
  },
  scheduleContainer: {
    flex: 1,
    marginBottom: 16,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
});

export default RegularSeason;
