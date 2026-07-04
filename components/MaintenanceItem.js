import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function MaintenanceItem({ task, due }) {
  return (
    <View style={styles.card}>
      {/* Maintenance icon */}
      <Entypo name="tools" size={22} color="#0057b7" />
      
      <View style={styles.cardText}>
        {/* Task and due date details */}
        <Text style={styles.cardTitle}>{task}</Text>
        <Text style={styles.cardDesc}>Due: {due}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});