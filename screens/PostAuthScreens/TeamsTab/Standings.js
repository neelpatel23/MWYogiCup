import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import colors from '../../../globalVariables/colors';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';

const Standings = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [standings, setStandings] = useState({});
  const [teamNames, setTeamNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch standings data
        const standingsSnapshot = await getDocs(collection(database, 'teamStandingsDATA'));
        const fetchedStandings = {};

        standingsSnapshot.forEach((doc) => {
          fetchedStandings[doc.id] = doc.data().teams;
        });

        setStandings(fetchedStandings);

        // Fetch team names
        const teamNamesSnapshot = await getDocs(collection(database, 'teamNamesDATA'));
        const fetchedTeamNames = teamNamesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTeamNames(fetchedTeamNames);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTable = () => {
    if (!selectedAgeGroup || !standings[selectedAgeGroup]) {
      return (
        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
          <Text>Select an age group to see their Schedule</Text>
        </View>
      );
    }

    const selectedStandings = standings[selectedAgeGroup];
    let tableData;

    if (selectedTeam) {
      const selectedTeamData = selectedStandings.find(team => team.team === selectedTeam);
      if (!selectedTeamData) {
        return (
          <View style={styles.noDataContainer}>
            <Text>No data available for selected team</Text>
          </View>
        );
      }

      tableData = [[selectedTeamData.team, selectedTeamData.wins, selectedTeamData.losses, selectedTeamData.points, selectedTeamData.plusMinus]];
    } else {
      tableData = selectedStandings.map(team => [team.team, team.wins, team.losses, team.points, team.plusMinus]);
    }

    const tableHead = ['Team', 'W', 'L', 'Points', '+/-'];

    return (
      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 1, borderColor: colors.primary }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </ScrollView>
    );
  };


  const handleTeamSelect = (teamName) => {
    setSelectedTeam(prevState => prevState === teamName ? '' : teamName);
  };

  const handleAgeGroupSelect = (ageGroup) => {
    setSelectedAgeGroup(ageGroup);
    setSelectedTeam(''); // Reset selected team when switching age groups
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
      <View style={styles.radioContainer}>
        {Object.keys(standings).map((ageGroup) => (
          <TouchableOpacity
            key={ageGroup}
            style={[
              styles.radioButton,
              { backgroundColor: ageGroup === selectedAgeGroup ? colors.primary : 'white' },
            ]}
            onPress={() => handleAgeGroupSelect(ageGroup)}
          >
            <Text style={{ color: ageGroup === selectedAgeGroup ? 'white' : colors.primary }}>
              {ageGroup}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView horizontal={true} style={styles.teamNamesContainer}>
        {selectedAgeGroup && teamNames.find(team => team.id === selectedAgeGroup)?.teams.map((team) => (
          <TouchableOpacity
            key={team}
            style={[
              styles.teamButton,
              { backgroundColor: team === selectedTeam ? colors.primary : 'white' },
            ]}
            onPress={() => handleTeamSelect(team)}
          >
            <Text style={{ color: team === selectedTeam ? 'white' : colors.primary }}>
              {team}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.standingsContainer}>
        {renderTable()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  head: { height: 40, backgroundColor: colors.primary },
  headText: { margin: 6, color: 'white', fontWeight: 'bold', fontSize: 16 },
  text: { margin: 6, fontSize: 14 },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 8,
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
  teamButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamNamesContainer: {
    maxHeight: 40,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  standingsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTeamContainer: {
    backgroundColor: colors.secondary,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  selectedTeamText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Standings;
