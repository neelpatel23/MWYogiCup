import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Icon from 'react-native-vector-icons/Ionicons'
import { OneSignal } from 'react-native-onesignal';

import Login from './screens/PreAuthScreens/Login';
import Home from './screens/PostAuthScreens/Home';
import * as SplashScreen from 'expo-splash-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from './globalVariables/colors';
import keys from './globalVariables/keys';
import AnnouncementTab from './screens/PostAuthScreens/AnnoucementTab/Annoucement';
import NewAnnouncement from './screens/PostAuthScreens/AnnoucementTab/NewAnnoucement';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthenticatedUserContext = createContext({});
OneSignal.initialize(keys.pushNotifsAPIKey)
OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
OneSignal.Notifications.addEventListener('click', (event) => {
  console.log('OneSignal: notification clicked:', event);
});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function AnnoucementStack({ navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Announcements"
        component={AnnouncementTab}
        options={{
          headerShown: true,
          headerTitle: 'Announcements',
          headerStyle: {
            backgroundColor: '#EFEFEF',
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
        }}
      />
      <Stack.Screen 
        name="NewAnnouncement" 
        component={NewAnnouncement} 
        options={{ 
          headerTitle: "New Announcement",
          headerStyle: {
            backgroundColor: '#EFEFEF', // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
        }} 
      />
    </Stack.Navigator>
  )
}

const MainStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="white"
      inactiveColor="lightgray"
      barStyle={styles.bottomTabStyle}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          // padding: 10,
          display: 'flex',
          // backgroundColor: '#EFEFEF',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Announcements') {
            iconName = focused ? 'notifications-outline' : 'notifications-outline';
          } else if (route.name === 'Teams') {
            iconName = focused ? 'basketball-outline' : 'basketball-outline'; // Choose appropriate icons
          } else if (route.name === 'Reels') {
            iconName = focused ? 'camera-outline' : 'camera-outline'; // Choose appropriate icons
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar-outline' : 'calendar-outline'
          } else if (route.name === 'Satsang') {
            iconName = focused ? 'book-outline' : 'book-outline'
          }
          return <Icon name={iconName} size={25} color={color} style={{ padding: 5, }} />;
        },
      })}
    >
      <Tab.Screen 
        name="Announcements" 
        component={AnnoucementStack} 
        options={{ 
          tabBarShowLabel: false,
          headerShown: false, 
          headerStyle: {
            backgroundColor: '#EFEFEF', // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      />
      <Tab.Screen 
        name="Schedule" 
        component={Home} 
        options={{ 
          headerShown: true, 
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#EFEFEF', // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      />
      <Tab.Screen 
        name="Satsang" 
        component={Home} 
        options={{ 
          headerShown: true, 
          tabBarShowLabel: false,
          // tabBarIcon: ({ focused, color, size }) => {
          //   return <Image 
          //           source={require('./assets/baps.png')}
          //           style={{ width: 18, height: 18 }}
          //         />;
          // },
          headerStyle: {
            backgroundColor: '#EFEFEF',
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      />
      <Tab.Screen 
        name="Teams" 
        component={Home} 
        options={{ 
          headerShown: true, 
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#EFEFEF', // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      />
      <Tab.Screen 
        name="Reels" 
        component={Home} 
        options={{ 
          headerShown: true, 
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#EFEFEF', // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      />
      
      {/* Add more Tab.Screen for other tabs */}
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      {/* Add more screens if necessary */}
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser ? authenticatedUser : null);
      setIsLoading(false);
      SplashScreen.hideAsync();
    });

    return unsubscribe; // Cleanup subscription
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    // <PaperProvider>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    // </PaperProvider>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabStyle: {
    backgroundColor: '#7851A9', // Adjust the color as needed
    height: 80, // Adjust the height as needed
  },
});

export default App;