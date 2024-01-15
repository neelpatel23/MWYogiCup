import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Keyboard,
  Platform
} from 'react-native';

import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth, database } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import colors from '../../globalStyles/colors';
const logoImage = require('../../assets/logo1.png'); // Replace with the path to your logo image

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [bkID, setbkID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoSize, setLogoSize] = useState({ width: 300, height: 300 });
  const [logoPosition, setLogoPosition] = useState({ top: 20 });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setLogoSize({ width: 200, height: 200 });
        setLogoPosition({ top: 0 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setLogoSize({ width: 300, height: 300 });
        setLogoPosition({ top: 20 });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onHandleLogin = async () => {
    if (email === '' || password === '' || bkID === '') {
      Alert.alert('Login Error', 'Email, password, and BKID fields cannot be blank.');
      return;
    }
  
    setLoading(true);
    try {
      // Perform email/password authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Check BKID after successful authentication
      const userDoc = await getDoc(doc(database, "users", userCredential.user.uid));
      if (!userDoc.exists() || userDoc.data().bkID !== bkID) {
        // If BKID check fails, sign out the user and alert
        await auth.signOut();
        throw new Error('Incorrect BKID - Email Combo');
      }
  
      // If this point is reached, both checks are successful
      // You can manually navigate or re-enable your listener here
  
    } catch (err) {
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={logoImage} style={[styles.logo, { width: logoSize.width, height: logoSize.height }, logoPosition]} />
          <TextInput
            style={styles.input}
            placeholder="Enter BKID / Person ID"
            placeholderTextColor='#000'
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            textContentType="bkid"
            autoFocus={true}
            value={bkID}
            onChangeText={(text) => setbkID(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor='#000'
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor='#000'
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
              <Text style={styles.buttonText}> Log In</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F6F7FB',
    width: '80%',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    width: '70%',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
