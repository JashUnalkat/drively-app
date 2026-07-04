import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function ScenariosScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning Scenarios</Text>
      <Text style={styles.subtitle}>
        Choose a learning option to improve your driving knowledge and safety awareness.
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Videos Education')}
      >
        <MaterialIcons name="ondemand-video" size={28} color="#0057b7" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Video Education</Text>
          <Text style={styles.cardDesc}>
            Watch short educational videos about safe driving situations.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Practice MCQ')}
      >
        <FontAwesome5 name="question-circle" size={26} color="#0057b7" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Practice MCQ</Text>
          <Text style={styles.cardDesc}>
            Answer multiple choice questions to test your driving knowledge.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0057b7',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
    elevation: 2,
  },
  cardText: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
});