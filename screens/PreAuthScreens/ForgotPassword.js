import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  ScrollView
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import colors from '../../globalVariables/colors';
const logoImage = require('../../assets/logo1.png'); // Replace with the path to your logo image

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [logoSize, setLogoSize] = useState({ width: 250, height: 250 });
    const [logoPosition, setLogoPosition] = useState({ top: 20 });
  
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        () => {
          setLogoSize({ width: 200, height: 200 });
          setLogoPosition({ top: 30 });
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
  
    const onHandleReset = () => {
      if (email !== '') {
        setLoading(true);
        sendPasswordResetEmail(auth, email)
          .then(() => {
            Alert.alert('Password reset email sent', 'Check your email to reset your password.');
            setLoading(false);
          })
          .catch((err) => {
            Alert.alert('Error', err.message);
            setLoading(false);
          });
      } else {
        Alert.alert('Error', 'Please enter your email address.');
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
            <View style={styles.header}>
              <Image source={logoImage} style={[styles.backImage, { width: logoSize.width, height: logoSize.height }, logoPosition]} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#000"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <TouchableOpacity style={styles.button} onPress={onHandleReset}>
                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Reset Password</Text>
              </TouchableOpacity>
            )}
            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
              <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Remembered your password? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: '#f57c00', fontWeight: '600', fontSize: 14 }}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.yogiCupBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      marginTop: StatusBar.currentHeight || 0,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
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
    backImage: {
      resizeMode: 'contain',
      marginBottom: 100,
    },
    button: {
      backgroundColor: '#f16827',
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: '70%',
    },
    keyboardAvoidingView: {
      flex: 1,
      width: '100%',
    },
    scrollViewContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
  });