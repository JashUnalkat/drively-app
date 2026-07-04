import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * VideosEducationScreen Component
 * Provides a theater-style video learning experience for driving safety.
 * Features: 
 * - Integrated WebView player for educational content.
 * - Dynamic course library with active state tracking.
 * - Branded UI using LinearGradient and custom badges.
 */

export default function VideosEducationScreen() {
  // State to track the currently playing video URL
  const [selectedVideo, setSelectedVideo] = useState('https://archive.org/embed/Winter_Driving_Safety_Tips');

  // Video metadata for the course library
  const videos = [
    {
      id: 1,
      title: 'Winter Driving Safety',
      description: 'Tips for driving safely in snow and icy conditions.',
      embedUrl: 'https://archive.org/embed/Winter_Driving_Safety_Tips',
      icon: 'weather-snowy'
    },
    {
      id: 2,
      title: 'Heavy Rain Driving',
      description: 'Learn how to handle rain, low visibility, and wet roads.',
      embedUrl: 'https://archive.org/embed/lufktx-Heavy_Rain_Driving_Tips',
      icon: 'weather-pouring'
    },
  ];

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* --- BRANDED HEADER --- */}
      <LinearGradient colors={['#0057b7', '#4f8cff']} style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Video Education</Text>
        <Text style={styles.headerSubtitle}>Master the roads through visual learning</Text>
      </LinearGradient>

      {/* --- VIDEO PLAYER SECTION --- */}
      <View style={styles.playerWrapper}>
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: selectedVideo }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            // Note: In a production environment, ensure your origin whitelist allows the embed source
          />
        </View>
      </View>

      {/* --- COURSE LIBRARY LIST --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>COURSE LIBRARY</Text>
        
        {videos.map((video) => {
          const isActive = selectedVideo === video.embedUrl;
          return (
            <TouchableOpacity
              key={video.id}
              style={[styles.card, isActive && styles.activeCard]}
              onPress={() => setSelectedVideo(video.embedUrl)}
              activeOpacity={0.7}
            >
              {/* Icon Container */}
              <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
                <MaterialCommunityIcons 
                  name={isActive ? "play-circle" : video.icon} 
                  size={26} 
                  color={isActive ? "#fff" : "#0057b7"} 
                />
              </View>
              
              {/* Text Metadata */}
              <View style={styles.cardText}>
                <View style={styles.row}>
                  <Text style={[styles.cardTitle, isActive && styles.activeText]}>{video.title}</Text>
                  {isActive && (
                    <View style={styles.playingBadge}>
                      <Text style={styles.playingBadgeText}>PLAYING</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardDesc, isActive && styles.activeDesc]}>{video.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  playerWrapper: {
    padding: 20,
    backgroundColor: '#1e293b', // Dark slate background for theater feel
    borderBottomWidth: 4,
    borderBottomColor: '#0057b7',
  },
  videoContainer: {
    height: 210,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  webview: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCard: {
    backgroundColor: '#0057b7',
    borderColor: '#0057b7',
    elevation: 4,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activeIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardText: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  activeText: {
    color: '#fff',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 18,
  },
  activeDesc: {
    color: 'rgba(255,255,255,0.8)',
  },
  playingBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playingBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0057b7',
  }
});