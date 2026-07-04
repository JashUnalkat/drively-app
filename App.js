import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebaseConfig';

// Context for App-wide state management 
import { ThemeProvider } from './context/ThemeContext';

// --- SCREEN IMPORTS ---
import HomeScreen from './screens/HomeScreen';
import BehaviorsScreen from './screens/BehaviorsScreen';
import ScenariosScreen from './screens/ScenariosScreen';
import VideosEducationScreen from './screens/VideosEducationScreen';
import PracticeMCQScreen from './screens/PracticeMCQScreen';
import MaintenanceScreen from './screens/MaintenanceScreen';
import InsuranceScreen from './screens/InsuranceScreen'; 
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AccountScreen from './screens/AccountScreen';

const Stack = createStackNavigator();

export default function App() {
  /** user state values */
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser || null);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);


  // Prevents the flickering of login screens while the app verifies identity
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0057b7" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, 
            headerStyle: { backgroundColor: '#ffffff' },
            headerTintColor: '#111',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {user === null ? (
            // --- AUTH STACK ---
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Sign Up" component={SignUpScreen} />
            </>
          ) : (
            // --- MAIN APP STACK ---
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Account" component={AccountScreen} />
              <Stack.Screen name="Behaviors" component={BehaviorsScreen} />
              <Stack.Screen name="Scenarios" component={ScenariosScreen} />
              <Stack.Screen name="Videos Education" component={VideosEducationScreen} />
              <Stack.Screen name="Practice MCQ" component={PracticeMCQScreen} />
              <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
              <Stack.Screen name="Insurance" component={InsuranceScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}