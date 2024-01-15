import React, {useState} from 'react';
import {Text, View, Button, Alert} from 'react-native';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

function Home() {
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        // Sign-out successful. User will be redirected to login by RootNavigator.
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>First Tab 1</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    );
  }

  export default Home