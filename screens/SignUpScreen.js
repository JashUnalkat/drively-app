import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
// Ensure db is exported from your firebaseConfig
import { auth, db } from '../firebaseConfig'; 

/**
 * SignUpScreen Component
 * Handles new user registration using Firebase Authentication and Firestore.
 * * Flow:
 * 1. Validate user input (empty fields, password match, password length).
 * 2. Create an Auth user with email/password.
 * 3. Update the Auth display name.
 * 4. Create a corresponding document in the 'users' Firestore collection for profile persistence.
 */
export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // --- 1. VALIDATION ---
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      // --- 2. FIREBASE AUTHENTICATION ---
      // Creates the user credentials in the Firebase Auth database
      const userCredential = await auth.createUserWithEmailAndPassword(
        email.trim(),
        password
      );

      const user = userCredential.user;

      // --- 3. UPDATE AUTH PROFILE ---
      // Sets the displayName property on the Auth object for quick access
      await user.updateProfile({
        displayName: fullName.trim(),
      });

      // --- 4. FIRESTORE PROFILE PERSISTENCE ---
      // Creates a document in the 'users' collection with the user's UID as the ID.
      // This is essential for storing custom data like driving scores or app settings.
      await db.collection('users').doc(user.uid).set({
        name: fullName.trim(),
        score: 75, // Starting score for the "Safe Driver" gamification
        email: email.trim(),
        createdAt: new Date().toISOString(),
      });

      console.log("Account and Firestore profile created!");
      // Navigation to Home usually happens automatically via Auth listener in App.js

    } catch (error) {
      // Improved error handling to provide user-friendly feedback
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('That email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('The email address is badly formatted.');
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to save your driving profile and track your progress.
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#94a3b8"
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity 
          style={[styles.signupButton, loading && { opacity: 0.7 }]} 
          onPress={handleSignUp} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0057b7',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: '#0057b7',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#0057b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#0057b7',
    fontWeight: '600',
    fontSize: 15,
  },
});