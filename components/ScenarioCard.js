import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ScenarioCard({ icon = 'warning', title, tip }) {
  return (
    <View style={styles.card}>
      {/* Icon representing the scenario type */}
      <MaterialIcons name={icon} size={24} color="#0057b7" />
      
      <View style={styles.cardText}>
        {/* Scenario title and tip details */}
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{tip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardText: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});