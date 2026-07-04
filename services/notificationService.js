import * as Notifications from 'expo-notifications';

export async function scheduleNotification(task, dueInSeconds) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Maintenance Reminder',
      body: `${task} is due soon!`,
    },
    trigger: { seconds: dueInSeconds },
  });
}