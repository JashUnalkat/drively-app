import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function BehaviorCard({ type, title, description }) {
  // Theme logic based on type prop
  const isPositive = type === 'positive';
  const iconName = isPositive ? 'thumbs-up' : 'exclamation-triangle';
  const iconColor = isPositive ? '#2e7d32' : '#c62828';

  return (
    <View style={styles.card}>
      {/* Icon representing behavior status */}
      <FontAwesome5 name={iconName} size={22} color={iconColor} />
      
      <View style={styles.cardText}>
        {/* Header and detail text */}
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
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