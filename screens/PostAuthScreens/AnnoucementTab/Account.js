import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { signOut, deleteUser } from 'firebase/auth';
import { auth, database } from '../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import colors from '../../../globalVariables/colors';

const AccountScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);  // Initialize loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(database, 'userDATA', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching user data
      }
    };

    fetchUserData();
  }, [user.uid]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Jay Swaminarayan, ${userData.firstName || 'User'}`,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [userData]);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const deleteAccount = async () => {
    await deleteUser(user);
    // Additional logic for post-deletion (navigation, state update, etc.)
  };

  const UserInfoCube = ({ title, detail }) => (
    <Card style={styles.cube}>
      <Card.Content>
        <View>
          <Title style={{ color: 'white'}}>{title}</Title>
          <Paragraph style={{ color: colors.primary}}>{detail}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cubeContainer}>
        <UserInfoCube title="Full Name" detail={`${userData.firstName || ''} ${userData.middleName ? userData.middleName + ' ' : ''}${userData.lastName || ''}`} />
        <UserInfoCube title="Email" detail={userData.email || 'Not available'} />
        <UserInfoCube title="Center" detail={userData.center || 'Not available'} />
        <UserInfoCube title="Group" detail={userData.group || 'Not available'} />
        <UserInfoCube title="User Role" detail={userData.userRole || 'Not available'} />
        <UserInfoCube title="Admin Display Name" detail={userData.adminDisplayName || 'Not available'} />
        <UserInfoCube title="T-Shirt Size" detail={userData.tShirtSize || 'Not available'} />
        <UserInfoCube title="Team" detail={userData.team || 'Not available'} />
        <UserInfoCube title="Hotel" detail={userData.hotel || 'Not available'} />
        <UserInfoCube title="Room #" detail={userData.room || 'Not available'} />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSignOut} style={styles.button}>Sign Out</Button>
        <Button mode="contained" onPress={deleteAccount} style={styles.deleteButton}>Delete Account</Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.yogiCupBlue,
    },
    cubeContainer: {
      flexDirection: "row",
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      padding: 10,
    },
    cube: {
        width: '47.3%', // Adjust the width as needed
        margin: 5,
        // borderColor: colors.primary,
        borderRadius: 8,
        backgroundColor: colors.yogiCupBlue, // Set a white or any light color for the cube's background
        // Override shadow and elevation for a flat look
        shadowOpacity: 0, // Remove shadow for iOS
        elevation: 0, // Remove elevation for Android
      },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 20,
    },
    button: {
      borderRadius: 20,
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 10,
      width: '40%',
    },
    deleteButton: {
      borderRadius: 20,
      backgroundColor: 'red',
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: '40%',
    },
    loadingContainer: {
      backgroundColor: colors.yogiCupBlue,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
export default AccountScreen;
