import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import { useTheme } from '../context/ThemeContext';

/**
 * LoginScreen Component
 * Handles user authentication via Firebase with integrated theme support.
 * Features: Real-time validation, error handling, and dynamic styling for Dark Mode.
 */
export default function LoginScreen({ navigation }) {
  const { isDarkMode, theme } = useTheme(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  /**
   * Authenticates user with Firebase and handles specific error codes
   * to provide user-friendly feedback.
   */
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    firebase
      .auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(() => {
        console.log('Login Successful');
      })
      .catch((error) => {
        console.log("Firebase Error Code:", error.code);
        
        switch (error.code) {
          case 'auth/invalid-email':
            setErrorMessage('The email address is badly formatted.');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-login-credentials':
            setErrorMessage('Invalid email or password.');
            break;
          case 'auth/user-disabled':
            setErrorMessage('This user account has been disabled.');
            break;
          case 'auth/network-request-failed':
            setErrorMessage('Network error. Check your connection.');
            break;
          case 'auth/too-many-requests':
            setErrorMessage('Too many failed attempts. Please try again later.');
            break;
          default:
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Helper to determine border color and background based on focus and theme
  const getInputStyle = (name) => [
    styles.inputWrapper,
    { backgroundColor: isDarkMode ? theme.card : '#f8fafc', borderColor: theme.border },
    focusedInput === name && { borderColor: theme.primary, borderWidth: 1.5 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled' bounces={false}>
          
          {/* Brand Header */}
          <LinearGradient
            colors={theme.headerGradient}
            style={styles.headerGradient}
          >
            <MaterialCommunityIcons name='shield-car' size={70} color='#fff' />
            <Text style={styles.title}>SafeDrive</Text>
            <Text style={styles.subtitle}>Secure Fleet & Personal Dashboard</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <Text style={[styles.welcomeText, { color: theme.textDark }]}>Welcome Back</Text>

            {/* Email Field */}
            <View style={getInputStyle('email')}>
              <MaterialCommunityIcons
                name='email-outline'
                size={20}
                color={focusedInput === 'email' ? theme.primary : theme.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.textDark }]}
                placeholder='Email Address'
                placeholderTextColor={theme.textLight}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize='none'
                keyboardType='email-address'
              />
            </View>

            {/* Password Field */}
            <View style={getInputStyle('password')}>
              <MaterialCommunityIcons
                name='lock-outline'
                size={20}
                color={focusedInput === 'password' ? theme.primary : theme.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.textDark }]}
                placeholder='Password'
                placeholderTextColor={theme.textLight}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
              <Text style={[styles.forgotText, { color: theme.textLight }]}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* User Feedback (Errors) */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name='alert-circle' size={18} color='#ef4444' />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.loginButton, 
                { backgroundColor: theme.primary },
                loading && styles.disabledButton
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text style={styles.loginButtonText}>Login to Dashboard</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textLight }]}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                <Text style={[styles.linkText, { color: theme.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- LAYOUT ---
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContent: { 
    flexGrow: 1 
  },

  // --- HERO HEADER ---
  headerGradient: {
    paddingTop: 64,
    paddingBottom: 48,
    alignItems: 'center',
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    // Add shadow for depth against the form
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: { 
    fontSize: 34, 
    fontWeight: '900', 
    color: '#fff', 
    marginTop: 12, 
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  subtitle: { 
    fontSize: 15, 
    color: 'rgba(255,255,255,0.85)', 
    marginTop: 6,
    fontWeight: '500'
  },

  // --- FORM INPUTS ---
  formContainer: { 
    paddingHorizontal: 28, 
    paddingTop: 36 
  },
  welcomeText: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#1e293b',
    marginBottom: 28, 
    textAlign: 'center' 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc', // Light slate background for inputs
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    height: 60,
  },
  inputIcon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600',
    color: '#0f172a'
  },
  forgotBtn: { 
    alignSelf: 'flex-end', 
    marginBottom: 24,
    paddingRight: 4
  },
  forgotText: { 
    fontSize: 14, 
    fontWeight: '700',
    color: '#0057b7' 
  },

  // --- FEEDBACK & ACTIONS ---
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1f2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  errorText: { 
    color: '#e11d48', 
    fontSize: 14, 
    marginLeft: 10, 
    fontWeight: '700', 
    flex: 1 
  },
  loginButton: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0057b7',
    // Button Shadow
    elevation: 6,
    shadowColor: '#0057b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: { 
    backgroundColor: '#cbd5e1', 
    elevation: 0,
    shadowOpacity: 0 
  },
  loginButtonText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '800',
    letterSpacing: 0.5
  },

  // --- FOOTER ---
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 32, 
    paddingBottom: 40 
  },
  footerText: { 
    fontSize: 15, 
    color: '#64748b',
    fontWeight: '500'
  },
  linkText: { 
    fontSize: 15, 
    fontWeight: '800',
    color: '#0057b7',
    marginLeft: 6
  },
});