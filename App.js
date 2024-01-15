import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider } from 'react-native-paper';

import Login from './screens/PreAuthScreens/Login';
import Home from './screens/PostAuthScreens/Home';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const MainStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="white"
      inactiveColor="lightgray"
      barStyle={styles.bottomTabStyle}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'clock';
              break;
            case 'Tasks':
              iconName = 'format-list-checkbox';
              break;
            // Add more cases for other tabs
            default:
              iconName = 'circle';
          }
          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Tasks" component={Home} />
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
    <PaperProvider>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </PaperProvider>
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