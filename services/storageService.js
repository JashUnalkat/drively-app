import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORE_KEY = 'safeDrive_score';

export async function saveScore(score) {
  try {
    await AsyncStorage.setItem(SCORE_KEY, JSON.stringify(score));
  } catch (error) {
    console.log('Error saving score:', error);
  }
}

export async function getScore() {
  try {
    const value = await AsyncStorage.getItem(SCORE_KEY);
    return value ? JSON.parse(value) : 82;
  } catch (error) {
    console.log('Error getting score:', error);
    return 82;
  }
}