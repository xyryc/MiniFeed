import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';
import User from './src/models/User';
import sequelize from './src/config/db';

const run = async () => {
  try {
    const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      initializeApp({ credential: cert(serviceAccount) });
      console.log('Firebase initialized.');
    } else {
      console.error('Service account not found');
      process.exit(1);
    }

    await sequelize.authenticate();
    const users = await User.findAll({ where: { fcmToken: { [sequelize.Sequelize.Op.not]: null } } });
    console.log(`Found ${users.length} users with FCM tokens`);

    for (const user of users) {
      console.log(`Testing token for user ${user.username}: ${user.fcmToken}`);
      try {
        const response = await getMessaging().send({
          token: user.fcmToken,
          notification: { title: 'Test', body: 'This is a test notification' },
          android: { priority: 'high' }
        });
        console.log('Successfully sent message:', response);
      } catch (error) {
        console.error('Error sending to', user.username, ':', error);
      }
    }
  } catch (error) {
    console.error('General error:', error);
  } finally {
    process.exit(0);
  }
};
run();
