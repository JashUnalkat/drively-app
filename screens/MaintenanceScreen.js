import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * MaintenanceScreen Component
 * Features: Service checklist and a Google Maps view pre-searched for repair shops.
 */
export default function MaintenanceScreen() {
  const [location, setLocation] = useState(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [locationError, setLocationError] = useState('');

  // --- MAINTENANCE STATE ---
  const [tasks, setTasks] = useState([
    { id: 1, task: 'Oil Change', due: 'Due in 500 km', status: 'urgent', limit: '500' },
    { id: 2, task: 'Tire Rotation', due: 'In 2 months', status: 'stable', limit: '2' },
    { id: 3, task: 'Brake Check', due: 'In 1,200 km', status: 'stable', limit: '1200' },
    { id: 4, task: 'Battery Health', due: 'Next Visit', status: 'stable', limit: '0' },
  ]);

  // --- MODAL STATE ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newLimit, setNewLimit] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setLocationError('Location permission denied.');
            setLoadingMap(false);
          }
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
          setLoadingMap(false);
        }
      } catch (error) {
        if (isMounted) {
          setLocationError('GPS signal lost.');
          setLoadingMap(false);
        }
      }
    };
    
    getUserLocation();
    return () => { isMounted = false; };
  }, []);

  // --- HANDLERS ---
  const openEditModal = (task) => {
    setSelectedTask(task);
    setNewLimit(task.limit);
    setIsModalVisible(true);
  };

  const saveLimit = () => {
    if (!newLimit) return;
    const updatedTasks = tasks.map((t) => {
      if (t.id === selectedTask.id) {
        return { 
          ...t, 
          limit: newLimit, 
          due: isNaN(newLimit) ? `Next ${newLimit}` : `Due in ${newLimit} km` 
        };
      }
      return t;
    });
    setTasks(updatedTasks);
    setIsModalVisible(false);
  };

  /**
   * renderMap: Loads Google Maps with a pre-defined search for "Repair Shops"
   * centered on the user's current coordinates.
   */
  const renderMap = () => {
    if (loadingMap) return (
      <View style={styles.mapPlaceholder}>
        <ActivityIndicator size="large" color="#0057b7" />
        <Text style={styles.footerText}>Locating nearby shops...</Text>
      </View>
    );
    
    if (locationError || !location) return (
      <View style={styles.mapPlaceholder}>
        <MaterialCommunityIcons name="map-marker-off" size={40} color="#94a3b8" />
        <Text style={styles.errorText}>{locationError || "Location unavailable"}</Text>
      </View>
    );

    // Google Maps Search URL logic:
    // query=repair+shop -> Finds the business type
    // center=lat,long -> Focuses search on user location
    const mapUrl = `https://www.google.com/maps/search/repair+shop/@${location.latitude},${location.longitude},14z`;
    
    return (
      <WebView
        originWhitelist={['*']}
        source={{ uri: mapUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator color="#0057b7" size="large" style={StyleSheet.absoluteFill} />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <LinearGradient colors={['#0057b7', '#4f8cff']} style={styles.headerGradient}>
          <MaterialCommunityIcons name="wrench-clock" size={60} color="#fff" />
          <Text style={styles.title}>Maintenance</Text>
          <Text style={styles.subtitle}>Vehicle Health & Service Milestones</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>SERVICE CHECKLIST</Text>
          
          <View style={styles.card}>
            {tasks.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.taskItem, index === tasks.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => openEditModal(item)}
              >
                <View style={[styles.iconBox, { backgroundColor: item.status === 'urgent' ? '#fef2f2' : '#f1f5f9' }]}>
                  <MaterialCommunityIcons 
                    name={item.status === 'urgent' ? "alert-circle" : "check-circle-outline"} 
                    size={22} 
                    color={item.status === 'urgent' ? "#ef4444" : "#0057b7"} 
                  />
                </View>
                <View style={styles.taskTextContainer}>
                  <Text style={styles.taskTitle}>{item.task}</Text>
                  <Text style={[styles.taskDue, item.status === 'urgent' && { color: '#ef4444', fontWeight: '700' }]}>
                    {item.due}
                  </Text>
                </View>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Map Section */}
          <Text style={styles.sectionLabel}>REPAIR SHOPS NEAR YOU</Text>
          <View style={styles.mapWrapper}>{renderMap()}</View>
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal animationType="fade" transparent={true} visible={isModalVisible}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Limit</Text>
            <Text style={styles.modalSubtitle}>{selectedTask?.task}</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveLimit}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- ROOT LAYOUT ---
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // --- BRANDED HEADER ---
  headerGradient: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    // Shadow / Elevation
    backgroundColor: '#0057b7',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  title: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },

  // --- MAIN CONTENT CONTAINERS ---
  formContainer: {
    padding: 24,
  },
  sectionLabel: {
    marginBottom: 14,
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // --- INTERACTIVE CARDS ---
  card: {
    marginBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    // Soft Shadow
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  taskDue: {
    marginTop: 3,
    fontSize: 13,
    color: '#64748b',
  },

  // --- MAP & VIEWPORT ---
  mapWrapper: {
    height: 400,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 4,
  },
  webview: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  // --- MODAL & INPUTS ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  modalContent: {
    width: '88%',
    padding: 28,
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    elevation: 20,
  },
  modalTitle: {
    marginBottom: 8,
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubtitle: {
    marginBottom: 24,
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    height: 56,
    marginBottom: 24,
    paddingHorizontal: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#1e293b',
  },

  // --- BUTTONS ---
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94a3b8',
  },
  saveButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#0057b7',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },

  // --- FEEDBACK & FOOTER ---
  errorText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
  },
  footerText: {
    marginTop: 12,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
});