import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Video } from 'expo-av';
import colors from '../../globalVariables/colors';

const header = require("../../assets/1.mp4");

export default function Home() {
  return (
    <View style={styles.container}>
      <Video
        volume={0.0}
        source={header}
        style={styles.video}
        isMuted={true}
        resizeMode='cover'
        shouldPlay
        isLooping
      />
      {/* <View style={styles.content}>
        <Text style={styles.text}>Hello, Animated Gradient!</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.yogiCupBlue,
    flex: 1,
  },
  video: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
