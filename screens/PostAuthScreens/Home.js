import React from 'react';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';
const header = require("../../assets/welcome.gif")

export default function Home() {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={header}
        style={styles.imageBackground}>
        <View style={styles.content}>
          <Text style={styles.text}>Hello, Animated Gradient!</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
