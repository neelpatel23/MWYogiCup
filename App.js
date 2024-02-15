import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { View, Easing, StyleSheet, Animated } from 'react-native';
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
import { Provider as PaperProvider } from 'react-native-paper'; // Import PaperProvider
import colors from './globalVariables/colors';
import keys from './globalVariables/keys';
import AnnouncementTab from './screens/PostAuthScreens/AnnoucementTab/Annoucement';
import NewAnnouncement from './screens/PostAuthScreens/AnnoucementTab/NewAnnoucement';
import AccountScreen from './screens/PostAuthScreens/AnnoucementTab/Account';
import ReelsScreen from './screens/PostAuthScreens/ReelsTab/ReelsScreen';
import FoodMenuScreen from './screens/PostAuthScreens/AnnoucementTab/FoodScreen';
import TeamsScreen from './screens/PostAuthScreens/TeamsTab/TeamsScreen';
import ForgotPassword from './screens/PreAuthScreens/ForgotPassword';
import FeedScreen from './screens/PostAuthScreens/ReelsTab/FeedScreen';
import NewPolls from './screens/PostAuthScreens/AnnoucementTab/NewPolls';
import MyReels from './screens/PostAuthScreens/ReelsTab/MyReels';

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

function AnnoucementStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Announcements"
        options={({ navigation }) => ({
          headerTintColor: 'white',
          headerShown: true,
          headerTitle: 'Announcements',
          headerStyle: {
            backgroundColor: colors.yogiCupBlue,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
        })}
      >
        {props => <AnnouncementTab {...props} navigation={props.navigation} />}
      </Stack.Screen>
      <Stack.Screen 
        name="NewPolls" 
        component={NewPolls} 
        options={{ 
          headerTintColor: 'white',
          headerBackTitle: "Polls",
          headerTitle: "New Poll",
          headerStyle: {
            backgroundColor: colors.yogiCupBlue, // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
        }} 
      />
      <Stack.Screen 
        name="NewAnnouncement" 
        component={NewAnnouncement} 
        options={{ 
          headerTintColor: 'white',
          headerBackTitle: "Feed",
          headerTitle: "New Announcement",
          headerStyle: {
            backgroundColor: colors.yogiCupBlue, // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
          },
        }} 
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerTintColor: 'white',
          headerBackTitle: '',
          headerStyle: {
            backgroundColor: colors.yogiCupBlue,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          }
        }}
      />
      <Stack.Screen
        name="Food"
        component={FoodMenuScreen}
        options={{
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          // headerBackTitle: '.',
          headerShown: true,
          headerTitle: 'Yogi Cup Dining',
          headerStyle: {
            backgroundColor: colors.yogiCupBlue,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
        }}
      />
    </Stack.Navigator>
  )
}
function ReelsStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Reels" 
        component={ReelsScreen} 
        options={{ 
          headerShown: false, // Set this to true to enable the header
          headerTransparent: true, // Set this to true to make the header transparent
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Use rgba for transparency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
        }} 
      />
      <Stack.Screen
        name="My Feed" 
        component={FeedScreen} 
        options={{ 
          headerTintColor: 'white',
          headerShown: true, // Set this to true to enable the header
          headerTransparent: false, // Set this to true to make the header transparent
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: colors.yogiCupBlue,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
        }} 
      />
      <Stack.Screen
        name="My Reels"
        component={MyReels}
        options={{
          headerTintColor: 'white',
          headerBackTitle: 'Feed',
          headerStyle: {
            backgroundColor: colors.yogiCupBlue,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          }
        }}
      />
    </Stack.Navigator>
  )
}
const MainStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Satsang"
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
          backgroundColor: colors.yogiCupBlue
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Announcements') {
            iconName = focused ? 'notifications-outline' : 'notifications-outline';
          } else if (route.name === 'Teams') {
            iconName = focused ? 'basketball-outline' : 'basketball-outline'; // Choose appropriate icons
          } else if (route.name === 'Reels') {
            iconName = focused ? 'camera-outline' : 'camera-outline'; // Choose appropriate icons
          {/* } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar-outline' : 'calendar-outline' */}
          } else if (route.name === 'Satsang') {
            iconName = focused ? 'book-outline' : 'book-outline'
          }
          return <Icon name={iconName} size={25} color={color} style={{ padding: 5, }} />;
        },
      })}
    >
      <Tab.Screen 
        name="Teams" 
        component={TeamsScreen} 
        options={{ 
          headerShown: false, 
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#EFEFEF', // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      />
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
      {/* <Tab.Screen 
        name="Schedule" 
        component={ScheduleStack} 
        options={{ 
          headerShown: false, 
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#EFEFEF', // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      /> */}
      <Tab.Screen 
        name="Satsang" 
        component={Home} 
        options={{ 
          headerTintColor: 'white',
          headerTitle: 'MW Yogi Cup 2024',
          headerShown: true, 
          tabBarShowLabel: false,
          // tabBarIcon: ({ focused, color, size }) => {
          //   return <Image 
          //           source={require('./assets/baps.png')}
          //           style={{ width: 18, height: 18 }}
          //         />;
          // },
          headerStyle: {
            backgroundColor: colors.yogiCupBlue, // Apply the same header style for consistency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          } 
        }} 
      />
      <Tab.Screen 
        name="Reels" 
        component={ReelsStack} 
        options={{ 
          headerShown: false, // Set this to true to enable the header
          headerTransparent: true, // Set this to true to make the header transparent
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Use rgba for transparency
            borderBottomWidth: 1,
            borderBottomColor: colors.primary
          },
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
      <Stack.Screen name="Forgot password" component={ForgotPassword} />
      {/* Add more screens if necessary */}
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [bounceValue] = useState(new Animated.Value(0));

  useEffect(() => {
    SplashScreen.hideAsync();
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser ? authenticatedUser : null);
      setTimeout(() => {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }, 2700); // 2.7 second delay

      // Smoother bouncing basketball animation
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: -100, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: -80, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: -50, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: -30, duration: 200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: -20, duration: 100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        // Animated.timing(bounceValue, { toValue: 0, duration: 100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]).start();
    });

    return unsubscribe; // Cleanup subscription
  }, [bounceValue, setUser]);

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <Animated.Image
          source={require('./assets/basketball.png')}
          style={{
            width: 100,
            height: 100,
            transform: [{ translateY: bounceValue }],
          }}
        />
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
    backgroundColor: "#21336a",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabStyle: {
    backgroundColor: '#7851A9', // Adjust the color as needed
    // backgroundColor: colors.yogiCupBlue,
    height: 80, // Adjust the height as needed
  },
});

export default App;

