import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import colors from '../../../globalVariables/colors';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';

const RegularSeason = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('K1');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const teamNamesSnapshot = await getDocs(collection(database, 'teamNamesDATA'));
        const fetchedTeamNames = teamNamesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTeamNames(fetchedTeamNames);

        const schedulesSnapshot = await getDocs(collection(database, 'regularSeasonDATA'));
        const fetchedSchedules = schedulesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSchedules(fetchedSchedules);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTeamNames = () => {
    if (!selectedAgeGroup) return null;

    const selectedTeamNames = teamNames.find(team => team.id === selectedAgeGroup)?.teams || [];

    return (
      <ScrollView horizontal={true} style={styles.teamNamesContainer} contentContainerStyle={styles.teamNamesContent}>
        {selectedTeamNames.map((teamName, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.radioButton,
              { backgroundColor: teamName === selectedTeam ? colors.primary : 'transparent' },
            ]}
            onPress={() => handleTeamSelect(teamName)}
          >
            <Text style={{ color: teamName === selectedTeam ? 'white' : 'white' }}>
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
        <View style={styles.noScheduleContainer}>
          <Text style={{ color: 'white'}}>Select an age group to see their Schedule</Text>
        </View>
      );
    }
  
    const selectedSchedule = schedules.find(schedule => schedule.id === selectedAgeGroup);
    const filteredSchedules = selectedTeam
      ? selectedSchedule.games.filter(game => game.team1 === selectedTeam || game.team2 === selectedTeam)
      : selectedSchedule.games;
  
    if (filteredSchedules.length === 0) {
      return (
        <View style={styles.noScheduleContainer}>
          <Text style={{ color: 'white'}}>No games found for selected team.</Text>
        </View>
      );
    }
  
    return (
      <ScrollView>
        {filteredSchedules.map((game, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Title style={{ color: 'black'}}>{game.team1} vs {game.team2}</Title>
              {/* <Title style={{ color: 'white'}}>{game.opponent}</Title> */}
              <Paragraph style={{ color: 'black'}}>Date: {game.date}</Paragraph>
              <Paragraph style={{ color: 'black'}}>Time: {game.time}</Paragraph>
              <Paragraph style={{ color: 'black'}}>Court: {game.court}</Paragraph>
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
              { backgroundColor: team.id === selectedAgeGroup ? colors.primary : 'transparent' },
            ]}
            onPress={() => setSelectedAgeGroup(prevState => prevState === team.id ? '' : team.id)}
          >
            <Text style={{ color: team.id === selectedAgeGroup ? 'white' : 'white' }}>
              {team.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderTeamNames()}
      <View style={styles.scheduleContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          renderSchedule()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  radioButton: {
    color: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  teamNamesContainer: {
    maxHeight: 40,
    flexDirection: 'row',
    marginBottom: 16,
  },
  teamNamesContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageGroupContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scheduleContainer: {
    flex: 1,
    marginBottom: 16,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    color: 'white',
    borderWidth: 1,
    // borderColor: colors.primary,
    backgroundColor: colors.cardBg
  },
  noScheduleContainer: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegularSeason;
