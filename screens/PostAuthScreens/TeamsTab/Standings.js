import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import colors from '../../../globalVariables/colors';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../../config/firebase';

const Standings = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('K1');
  const [standings, setStandings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const standingsSnapshot = await getDocs(collection(database, 'teamStandingsDATA'));
        const fetchedStandings = {};

        standingsSnapshot.forEach((doc) => {
          fetchedStandings[doc.id] = doc.data().teams;
        });

        setStandings(fetchedStandings);
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
        <View style={styles.noDataContainer}>
          <Text>Select an age group to see the standings</Text>
        </View>
      );
    }
  
    const selectedStandings = standings[selectedAgeGroup];
    const tableData = selectedStandings.map(team => [team.team, team.wins, team.losses, team.points]);
    const tableHead = ['Team', 'W', 'L', 'Points'];
  
    return (
      <ScrollView>
        <View style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: colors.primary }}>
            <Row
              data={tableHead}
              style={[styles.row, styles.headRow]} // Apply headRow style to the header row
              textStyle={styles.headText}
              flexArr={[2.5, 1, 1, 1]} // Set the flex ratios for each column
            />
            {tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                textStyle={styles.text}
                flexArr={[2.5, 1, 1, 1]} // Set the flex ratios for each column
              />
            ))}
          </Table>
        </View>
      </ScrollView>
    );
  };

  const handleAgeGroupSelect = (ageGroup) => {
    setSelectedAgeGroup(ageGroup);
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
              { backgroundColor: ageGroup === selectedAgeGroup ? colors.primary : 'transparent' },
            ]}
            onPress={() => handleAgeGroupSelect(ageGroup)}
          >
            <Text style={{ color: ageGroup === selectedAgeGroup ? 'white' : 'white' }}>
              {ageGroup}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.standingsContainer}>
        {renderTable()}
      </View>
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
  headRow: { // Additional style for the header row
    backgroundColor: colors.primary,
  },
  text: { margin: 6, fontSize: 14 },
  row: {
    justifyContent: 'center',
    height: 40,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.primary,
  },
  teamNameCell: {
    flex: 3, // Adjust the width of the team name column
    justifyContent: 'center',
    alignItems: 'flex-start', // Align text to the start (left)
    paddingLeft: 10, // Add some padding to the left for better readability
  },
  evenRow: {
    backgroundColor: colors.cardBg,
  },
  oddRow: {
    backgroundColor: colors.cardBg,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  radioButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    marginBottom: 5,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  standingsContainer: {
    flex: 1,
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
  tableContainer: {
    flex: 1,
    marginBottom: 16,
  },
});

export default Standings;
