import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth, database } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import colors from '../../globalVariables/colors';
const logoImage = require('../../assets/logo1.png'); // Replace with the path to your logo image

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [IdentNumber, setIdentNumber] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoSize, setLogoSize] = useState({ width: 250, height: 250 });
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
        setLogoSize({ width: 250, height: 250 });
        setLogoPosition({ top: 20 });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onHandleLogin = async () => {
    if (email === '' || password === '' || IdentNumber === null) {
      Alert.alert('Login Error', 'Email, password, and ID fields cannot be blank.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(database, "userDATA", userCredential.user.uid));
      if (!userDoc.exists() || userDoc.data().identNumber !== Number(IdentNumber)) {
        await auth.signOut();
        throw new Error('Incorrect ID - Email Combo');
      }
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
            textContentType="creditCardNumber"
            autoFocus={true}
            value={IdentNumber ? IdentNumber.toString() : ''}
            onChangeText={(text) => setIdentNumber(text ? Number(text) : null)}
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
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
              <Text style={styles.buttonText}> Log In</Text>
            </TouchableOpacity>
          )}
          <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
            <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Forgot your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Forgot password")}>
              <Text style={{ color: '#f57c00', fontWeight: '600', fontSize: 14 }}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.yogiCupBlue,
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
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: 50,
  },
  input: {
    backgroundColor: '#F6F7FB',
    width: '80%',
    height: 58,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f16827",
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
