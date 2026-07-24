import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  initializeApp({
    credential: cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} else {
  console.warn('WARNING: firebase-service-account.json not found. Push notifications will not be sent.');
}

export const sendPushNotification = async (token: string, title: string, body: string) => {
  if (getApps().length === 0) return;

  try {
    await getMessaging().send({
      token,
      notification: { title, body },
      android: { priority: 'high' },
    });
  } catch (error) {
    console.error('Error sending FCM notification:', error);
  }
};
