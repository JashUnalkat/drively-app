import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  SafeAreaView 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BehaviorCard from '../components/BehaviorCard';

const { width } = Dimensions.get('window');
// Rotation sequence of speed values for the simulation
const speedLevels = [0, 40, 60, 80, 120, 150];

export default function BehaviorsScreen() {
  const [index, setIndex] = useState(0);
  const speedKmh = speedLevels[index];

  // Simulates real-time speed changes every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % speedLevels.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Returns UI theme and messaging based on current speed thresholds
  const getSpeedStatus = () => {
    if (speedKmh >= 120) return { 
      label: 'EXTREME DANGER', 
      color: '#ef4444', 
      bg: '#fee2e2',
      icon: 'alert-octagon',
      msg: 'Fatal accident risk. Slow down immediately!' 
    };
    if (speedKmh >= 80) return { 
      label: 'SLOW DOWN', 
      color: '#f59e0b', 
      bg: '#fef3c7',
      icon: 'alert-circle',
      msg: 'You are exceeding the safe speed limit.' 
    };
    if (speedKmh >= 40) return { 
      label: 'STABLE SPEED', 
      color: '#3b82f6', 
      bg: '#dbeafe',
      icon: 'check-circle',
      msg: 'Maintaining acceptable cruising speed.' 
    };
    return { 
      label: 'SAFE / IDLE', 
      color: '#10b981', 
      bg: '#dcfce7',
      icon: 'shield-check',
      msg: 'Vehicle is operating at a safe pace.' 
    };
  };

  const status = getSpeedStatus();

  // Mock data for the weekly performance bar chart
  const previousScores = [
    { date: 'Mon', score: 78 }, { date: 'Tue', score: 82 },
    { date: 'Wed', score: 75 }, { date: 'Thu', score: 88 },
    { date: 'Fri', score: 80 }, { date: 'Sat', score: 92 },
  ];

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        <Text style={styles.headerTitle}>Driving Insights</Text>

        {/* Speedometer visualization card */}
        <View style={styles.speedCard}>
          <LinearGradient
            colors={['#fff', '#f8fafc']}
            style={styles.gaugeInner}
          >
            {/* Circular speed display */}
            <View style={[styles.outerRing, { borderColor: status.color }]}>
              <Text style={[styles.speedNumber, { color: status.color }]}>{speedKmh}</Text>
              <Text style={styles.speedUnit}>KM/H</Text>
            </View>

            {/* Status badge and contextual warning message */}
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <MaterialCommunityIcons name={status.icon} size={16} color={status.color} />
              <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
            </View>

            <Text style={styles.speedMessage}>{status.msg}</Text>
          </LinearGradient>
        </View>

        {/* Horizontal scroll for weekly safety score history */}
        <Text style={styles.sectionLabel}>WEEKLY PERFORMANCE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
          {previousScores.map((item, i) => (
            <View key={i} style={styles.historyCard}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyScore}>{item.score}</Text>
              {/* Dynamic height bar based on score */}
              <View style={[styles.scoreBar, { height: item.score / 4, backgroundColor: item.score > 80 ? '#10b981' : '#3b82f6' }]} />
            </View>
          ))}
        </ScrollView>

        {/* List of recent driving behavior events (Positive/Negative) */}
        <Text style={styles.sectionLabel}>RECENT EVENTS</Text>
        <View style={styles.behaviorList}>
          {[
            { id: 1, type: 'positive', title: 'Smooth Braking', desc: 'Gradual stop at intersection.', score: '+8' },
            { id: 2, type: 'negative', title: 'Harsh Turn', desc: 'High G-force detected on left turn.', score: '-12' }
          ].map((item) => (
            <View key={item.id} style={styles.behaviorItem}>
              <View style={[styles.iconBox, { backgroundColor: item.type === 'positive' ? '#dcfce7' : '#fee2e2' }]}>
                <MaterialCommunityIcons 
                  name={item.type === 'positive' ? 'trending-up' : 'trending-down'} 
                  size={24} 
                  color={item.type === 'positive' ? '#10b981' : '#ef4444'} 
                />
              </View>
              <View style={styles.behaviorText}>
                <Text style={styles.behaviorTitle}>{item.title}</Text>
                <Text style={styles.behaviorDesc}>{item.desc}</Text>
              </View>
              {/* Point impact indicator */}
              <Text style={[styles.scoreTag, { color: item.type === 'positive' ? '#10b981' : '#ef4444' }]}>
                {item.score}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- LAYOUT & WRAPPERS ---
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc', // Modern off-white/slate tint
  },
  container: {
    padding: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 24,
    letterSpacing: -0.5,
  },

  // --- SCORE/SPEED GAUGE CARD ---
  speedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 6,
    marginBottom: 32,
    // Soft depth shadow
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  gaugeInner: {
    borderRadius: 28,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 10,
    borderColor: '#f1f5f9', // Visual track for the "ring"
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  speedNumber: {
    fontSize: 52,
    fontWeight: '900',
    color: '#1e293b',
    includeFontPadding: false,
  },
  speedUnit: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: -2,
  },
  
  // --- STATUS ELEMENTS ---
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 100, 
    marginTop: 20,
    backgroundColor: '#f1f5f9',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  speedMessage: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 15,
  },

  // --- HORIZONTAL MINI CARDS ---
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.2,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  historyScroll: {
    paddingBottom: 10,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    width: 80,
    height: 115,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  historyDate: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
  },
  historyScore: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  scoreBar: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
  },

  // --- VERTICAL BEHAVIOR LIST ---
  behaviorList: {
    marginTop: 4,
  },
  behaviorItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  behaviorText: {
    flex: 1,
    marginLeft: 16,
  },
  behaviorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  behaviorDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 18,
  },
  scoreTag: {
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 10,
  }
});