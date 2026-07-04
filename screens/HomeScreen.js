import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  StatusBar, SafeAreaView, ActivityIndicator
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import ScoreGauge from '../components/ScoreGauge';
import { auth, db } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  // Access theme context for dark/light mode and styling
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const [userData, setUserData] = useState({ name: 'Loading...', score: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Real-time listener for user data in Firestore
    const unsubscribe = db.collection('users').doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setUserData({
            name: data.name || user.displayName || "Driver",
            score: data.score || 0
          });
        } else {
          // Fallback if document doesn't exist yet
          setUserData({ 
            name: user.displayName || user.email.split('@')[0], 
            score: 50 
          });
        }
        setLoading(false);
      }, (error) => {
        console.error("Firestore Error:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  /**
   * Returns a profile label, color, and icon based on the safety score
   * @param {number} score - The user's current safety percentage
   */
  const getProfile = (score) => {
    if (score >= 95) return { label: 'Wonderful Driver', color: '#FFD700', icon: 'crown' }; 
    if (score >= 81) return { label: 'Excellent Driver', color: '#2ecc71', icon: 'star' }; 
    if (score >= 61) return { label: 'Good Driver', color: '#3498db', icon: 'thumb-up' }; 
    if (score >= 41) return { label: 'Average Driver', color: '#f39c12', icon: 'car' }; 
    return { label: 'Reckless Driver', color: '#e74c3c', icon: 'alert-decagram' }; 
  };

  const driverProfile = getProfile(userData.score);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header Section with Gradient and Summary Stats */}
      <LinearGradient colors={theme.headerGradient} style={styles.topGradient}>
        <SafeAreaView style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: 'rgba(255,255,255,0.8)' }]}>
              Welcome back, {userData.name} 👋
            </Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
              <MaterialCommunityIcons 
                name={isDarkMode ? "weather-sunny" : "weather-night"} 
                size={26} color="#fff" 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Account')}>
              <FontAwesome5 name="user-alt" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Quick stats: Distance, Score, and Trip Count */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,240</Text>
            <Text style={styles.statLabel}>KM Driven</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.score}%</Text>
            <Text style={styles.statLabel}>Safety</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Main Safety Status Card with Score Gauge */}
          <View style={[styles.gaugeCard, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.textDark }]}>SafeDrive Status</Text>
              <MaterialCommunityIcons name={driverProfile.icon} size={24} color={driverProfile.color} />
            </View>
            <ScoreGauge score={userData.score} />
            <Text style={[styles.scoreFeedback, { color: theme.textLight }]}>
              You are a <Text style={{fontWeight: '900', color: driverProfile.color}}>{driverProfile.label}</Text>!
            </Text>
          </View>

          {/* Navigation Grid for various app features */}
          <Text style={[styles.sectionTitle, { color: theme.textDark }]}>Manage Safety</Text>
          <View style={styles.grid}>
            <GridItem icon="car-connected" title="Behaviors" colors={['#6366f1', '#818cf8']} onPress={() => navigation.navigate('Behaviors')} />
            <GridItem icon="alert-octagon" title="Scenarios" colors={['#f43f5e', '#fb7185']} onPress={() => navigation.navigate('Scenarios')} />
            <GridItem icon="wrench" title="Maintenance" colors={['#f59e0b', '#fbbf24']} onPress={() => navigation.navigate('Maintenance')} />
            <GridItem icon="shield-check" title="Insurance" colors={['#10b981', '#34d399']} onPress={() => navigation.navigate('Insurance')} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

/**
 * Reusable component for the dashboard grid navigation buttons
 */
const GridItem = ({ icon, title, colors, onPress }) => (
  <TouchableOpacity style={styles.gridItem} onPress={onPress} activeOpacity={0.9}>
    <LinearGradient colors={colors} style={styles.gradientButton}>
      <MaterialCommunityIcons name={icon} size={32} color="#fff" />
      <Text style={styles.gridText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // --- ROOT LAYOUT ---
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // --- BRANDED HEADER SECTION ---
  topGradient: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 60,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeBtn: {
    marginRight: 16,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  profileBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  // --- TOP STATS ROW ---
  statsRow: {
    flexDirection: 'row',
    marginTop: 32,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 6,
    textTransform: 'uppercase',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
  },

  // --- FLOATING CONTENT AREA ---
  contentWrapper: {
    flex: 1,
    marginTop: -40, // Pulls the first card up over the gradient
    paddingHorizontal: 20,
  },
  gaugeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    // Soft Elevation
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  scoreFeedback: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },

  // --- NAVIGATION GRID ---
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 36,
    marginBottom: 16,
    paddingLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '47.5%', // Slightly adjusted for precise spacing
    height: 125,
    borderRadius: 28,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    // Grid Elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 28,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridText: {
    marginTop: 12,
    fontWeight: '900',
    color: '#ffffff',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});