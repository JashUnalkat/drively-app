import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, 
  Alert, Image, Switch, Modal, SafeAreaView, ActivityIndicator
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext'; 

export default function AccountScreen() {
  // Access global theme state 
  const { isDarkMode, theme } = useTheme();
  const user = auth.currentUser;

  // Local state for UI toggles and user data
  const [isEditing, setIsEditing] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [displayName, setDisplayName] = useState(''); 
  const [loading, setLoading] = useState(false);

  // Sync display name from Firestore on component mount or user change
  useEffect(() => {
    if (!user) return;
    const unsubscribe = db.collection('users').doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setDisplayName(doc.data().name || user.displayName || '');
        } else {
          setDisplayName(user.displayName || '');
        }
      });
    return () => unsubscribe();
  }, [user]);

  // Handle profile name updates in both Firebase Auth and Firestore
  const handleUpdate = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      await user.updateProfile({ displayName: displayName.trim() });
      await db.collection('users').doc(user.uid).update({ name: displayName.trim() });
      Alert.alert('Success', 'Profile updated!');
      setIsEditing(false);
    } catch (e) { 
      Alert.alert('Error', e.message); 
    } finally {
      setLoading(false);
    }
  };

  // Static FAQ content
  const faqs = [
    { q: "How is my Safety Score calculated?", a: "We analyze your acceleration, braking, and cornering habits using your phone's sensors." },
    { q: "How can I improve my rating?", a: "Focus on smooth braking and maintaining consistent speeds." },
    { q: "Is my data shared with insurance?", a: "No. Your data is private and only used to help you become a safer driver." },
    { q: "Does the app drain my battery?", a: "We use optimized tracking, but keeping the phone plugged in is recommended." }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Profile Header with Avatar and Email */}
        <LinearGradient colors={theme.headerGradient} style={styles.header}>
          <View style={styles.avatarWrapper}>
            {/* Dynamic avatar based on current display name */}
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${displayName || 'User'}&background=FFD700&color=000` }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.userName}>{displayName || 'Safe Driver'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </LinearGradient>

        <View style={styles.body}>
          {/* Section: Personal Information Editing */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: theme.textLight }]}>PERSONAL INFO</Text>
            <TouchableOpacity onPress={() => isEditing ? handleUpdate() : setIsEditing(true)}>
              <Text style={[styles.actionText, { color: theme.primary }]}>{isEditing ? 'SAVE' : 'EDIT'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.input, { color: theme.textDark, borderBottomColor: theme.primary }]} 
                value={displayName} 
                onChangeText={setDisplayName} 
                autoFocus 
              />
            ) : (
              <Text style={[styles.value, { color: theme.textDark }]}>{displayName || 'Not Set'}</Text>
            )}
          </View>

          {/* Section: App Support Links */}
          <Text style={[styles.sectionLabel, { color: theme.textLight }]}>SUPPORT & HELP</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.settingsRow} onPress={() => setShowFAQ(true)}>
              <View style={styles.iconLabel}>
                <MaterialCommunityIcons name="help-circle-outline" size={22} color={theme.primary} />
                <Text style={[styles.settingsText, { color: theme.textDark }]}>FAQ</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={14} color={theme.textLight} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.settingsRow} onPress={() => setShowPrivacy(true)}>
              <View style={styles.iconLabel}>
                <MaterialCommunityIcons name="shield-check-outline" size={22} color={theme.primary} />
                <Text style={[styles.settingsText, { color: theme.textDark }]}>Privacy Policy</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={14} color={theme.textLight} />
            </TouchableOpacity>
          </View>

          {/* Authentication Sign Out */}
          <TouchableOpacity style={styles.logoutBtn} onPress={() => auth.signOut()}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Shared Modal for FAQ and Privacy Policy */}
      <Modal animationType="slide" visible={showFAQ || showPrivacy} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textDark }]}>
                {showFAQ ? "FAQ" : "Privacy Policy"}
              </Text>
              <TouchableOpacity onPress={() => { setShowFAQ(false); setShowPrivacy(false); }}>
                <FontAwesome5 name="times" size={20} color={theme.textDark} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {showFAQ ? (
                faqs.map((item, index) => (
                  <View key={index} style={styles.faqItem}>
                    <Text style={[styles.policyHeading, { color: theme.textDark }]}>{item.q}</Text>
                    <Text style={[styles.policyText, { color: theme.textLight }]}>{item.a}</Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.policyText, { color: theme.textLight }]}>Your privacy is our priority...</Text>
              )}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    paddingVertical: 50, 
    alignItems: 'center', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  avatarWrapper: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: '#fff', 
    padding: 3, 
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  avatar: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 45 
  },
  userName: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '900', 
    marginTop: 12 
  },
  userEmail: { 
    color: '#e0e7ff', 
    fontSize: 14,
    fontWeight: '600'
  },
  body: { 
    padding: 25 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginVertical: 10, 
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  actionText: { 
    fontWeight: '900',
    fontSize: 14
  },
  card: { 
    backgroundColor: '#fff',
    borderRadius: 30, 
    padding: 25, 
    marginBottom: 25, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 15 
  },
  label: { 
    fontSize: 12, 
    color: '#94a3b8', 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  value: { 
    fontSize: 18, 
    fontWeight: '700'
  },
  input: { 
    fontSize: 18, 
    borderBottomWidth: 2, 
    paddingVertical: 5,
    fontWeight: '700'
  },
  settingsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 15 
  },
  iconLabel: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  settingsText: { 
    marginLeft: 15, 
    fontSize: 16, 
    fontWeight: '700' 
  },
  divider: { 
    height: 1, 
    marginVertical: 5,
    opacity: 0.5 
  },
  logoutBtn: { 
    backgroundColor: '#ef4444', 
    padding: 20, 
    borderRadius: 30, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  logoutText: { 
    color: '#fff', 
    fontWeight: '900', 
    fontSize: 18,
    textTransform: 'uppercase'
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    height: '75%', 
    padding: 30 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: '900' 
  },
  faqItem: { 
    marginBottom: 25 
  },
  policyHeading: { 
    fontSize: 16, 
    fontWeight: '900',
    marginBottom: 8
  },
  policyText: { 
    fontSize: 15, 
    lineHeight: 24,
    fontWeight: '500'
  }
});