import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

const BracketGame = ({ team1, team2, score1, score2 }) => {
  const isTeam1Winning = score1 > score2;
  const isTeam2Winning = score2 > score1;

  return (
    <View style={styles.gameContainer}>
      <View style={styles.teamContainer}>
        <Text style={[styles.teamText, isTeam1Winning && styles.winningTeam]}>
          {team1} 
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text
          style={[styles.scoreText, isTeam1Winning && styles.winningScore]}
        >
          {score1}
        </Text>
        <Text style={styles.vsText}>vs</Text>
        <Text
          style={[styles.scoreText, isTeam2Winning && styles.winningScore]}
        >
          {score2}
        </Text>
      </View>
      <View style={styles.teamContainer}>
        <Text style={[styles.teamText, isTeam2Winning && styles.winningTeam]}>
          {team2}
        </Text>
      </View>
    </View>
  );
};

const BracketRound = ({ round }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.roundContainer}>
      <Text style={styles.roundLabel}>{round.roundName}</Text>
      {round.games.map((game, index) => (
        <BracketGame
          key={index}
          team1={game.team1}
          team2={game.team2}
          score1={game.score1}
          score2={game.score2}
        />
      ))}
    </View>
  </ScrollView>
);

const TournamentBracket = () => {
  const [tournamentRounds, setTournamentRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('K1'); // Initial selected group

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const docRef = doc(database, 'tournamentDATA', selectedGroup);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTournamentRounds(docSnap.data().rounds || []);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [selectedGroup]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Radio buttons for selecting age groups */}
      <View style={styles.radioContainer}>
        {['K1', 'K2', 'YM'].map((group) => (
          <TouchableOpacity
            key={group}
            style={[
              styles.radioButton,
              { backgroundColor: group === selectedGroup ? colors.primary : 'transparent' },
            ]}
            onPress={() => setSelectedGroup(group)}
          >
            <Text style={{ color: group === selectedGroup ? 'white' : 'white' }}>
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
  
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {tournamentRounds.map((round, index) => (
          <BracketRound key={index} round={round} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
    maxHeight: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  roundContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  winningTeam: {
    color: 'lightgreen', // Change to the color you want for the winning team
  },
  winningScore: {
    fontSize: 20,
    fontWeight: 'bold',
    // Add any additional styles for the winning score
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
    color: 'white',
  },
  gameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: 'transparent',
    // width: "100%", // Adjust the width as needed
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Adjust spacing between team scores and vs text
    flex: 1, // Add flex: 1 to make the score container take up remaining space
  },
  
  teamText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  scoreText: {
    marginHorizontal: 5,
    fontSize: 16,
    color: colors.primary,
  },
  vsText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#888888',
    alignSelf: 'center', // Add this line to center the text vertically
  },
  // Styles for radio buttons
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

export default TournamentBracket;