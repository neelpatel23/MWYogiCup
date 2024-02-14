import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { auth, database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

const YourSchedule = () => {
  const [userData, setUserData] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        const userDataDoc = doc(database, 'userDATA', user.uid);
        const userDocSnap = await getDoc(userDataDoc);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }

        const gamesSnapshot = await getDocs(collection(database, 'regularSeasonDATA'));
        const allGames = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserGames(allGames);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [auth.currentUser.uid]);

  const renderSchedule = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!userData) {
      return null; // Wait until user data is fetched
    }

    const filteredGames = userGames.reduce((filtered, currentGroup) => {
      if (currentGroup.id === userData.group) {
        currentGroup.games.forEach(game => {
          if (game.team1 === userData.team || game.team2 === userData.team) {
            filtered.push(game);
          }
        });
      }
      return filtered;
    }, []);

    if (filteredGames.length === 0) {
      return (
        <View style={styles.noGamesContainer}>
          <Text style={styles.noGamesText}>No games scheduled for your team.</Text>
        </View>
      );
    }

    return (
      <ScrollView>
        {filteredGames.map((game, index) => (
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

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <Text style={styles.title}>{userData.firstName} - {userData.group}</Text>
          <Text style={styles.subtitle}>{userData.center} - {userData.team || 'N/A'}</Text>
          {renderSchedule()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    // fontFamily: 'Benton Sans Ultra Condensed Bold',
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10
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
  noGamesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGamesText: {
    fontSize: 16,
    color: colors.yogiCupBlue,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YourSchedule;
