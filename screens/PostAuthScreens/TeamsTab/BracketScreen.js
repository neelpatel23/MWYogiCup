import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

const windowWidth = Dimensions.get('window').width;


const BracketGame = ({ team1, team2, score1, score2 }) => {
  const isTeam1Winning = score1 > score2;
  const isTeam2Winning = score2 > score1;

  return (
    <View style={styles.gameContainer}>
      <View style={[styles.teamScoreContainer, isTeam1Winning && styles.winningTeam]}>
        <Text style={[styles.teamText]}>{team1 || 'TBD'}</Text>
        <Text style={[styles.scoreText, isTeam1Winning && styles.winningText]}>{score1}</Text>
      </View>

      <Text style={styles.vsText}>vs</Text>

      <View style={[styles.teamScoreContainer, isTeam2Winning && styles.winningTeam]}>
        <Text style={[styles.teamText]}>{team2 || 'TBD'}</Text>
        <Text style={[styles.scoreText, isTeam2Winning && styles.winningText]}>{score2}</Text>
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
    width: windowWidth, // Adjust to the width of the window
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  roundContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
  },
  winningTeam: {
    borderRadius: 10,
    padding: 5,
  },
  winningText: {
    color: 'green',
  },
  winningScore: {
    fontWeight: 'bold',
    color: colors.winColor, // Define this color in your globalVariables/colors
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
    alignContent: 'center',
    // justifyContent: 'space-around',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    // paddingHorizontal: 10,
    width: windowWidth - 40, // Subtracting the total padding from windowWidth
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  teamScoreContainer: {
    padding: 5,
    // justifyContent: 'center',
    alignItems: 'center',
    maxWidth: (windowWidth / 2) - 40, // Adjusted for padding and vsText width
  },
  teamText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: 16,
    color: '#888888',
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

export default TournamentBracket;