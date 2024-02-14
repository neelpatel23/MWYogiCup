import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import TournamentBracket from './BracketScreen';
import Standings from './Standings';
import colors from '../../../globalVariables/colors';
import RegularSeason from './RegularSeason';
import YourSchedule from './YourSchedule';


const TeamsScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 't1', title: 'Regular Season' },
    { key: 't2', title: 'Your Schedule' },
    { key: 't3', title: 'Team Standings' }, 
    { key: 't4', title: 'Playoff Bracket' }, 
  ]);


  const renderScene = SceneMap({
    t1: () => <RegularSeason />,
    t2: () => <YourSchedule />,
    t3: () => <Standings />,
    t4: () => <TournamentBracket ageGroup="K1" />,
  });
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: '100%' }}
          renderTabBar={props => (
            <TabBar
              {...props} 
              style={styles.tabBar} 
              labelStyle={styles.tabLabel} 
              indicatorStyle={styles.tabIndicator}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: colors.universalBg,
    backgroundColor: colors.yogiCupBlue
  },
  container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  card: {
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.yogiCupBlue,
  },
  tabBar: {
    backgroundColor: colors.yogiCupBlue,
    // Add other styles for the tab bar here if needed
    
  },
  tabLabel: {
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    color: 'white', // Change the text color to white
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'none'
  },
  tabIndicator: {
    backgroundColor: colors.primary, // Change the indicator color
    height: 2, // Optional: Adjust the height of the indicator
  },
});

export default TeamsScreen;
