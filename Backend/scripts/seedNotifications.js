const mongoose = require('mongoose');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');
require('dotenv').config();

const seedNotifications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kufe');
    console.log('Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });
    
    if (adminUsers.length === 0) {
      console.log('No admin users found. Please create an admin user first.');
      return;
    }

    console.log(`Found ${adminUsers.length} admin user(s)`);

    // Create sample system notifications
    const sampleNotifications = [
      {
        title: 'System Startup',
        message: 'KUFE Management System has been successfully initialized and is ready for use.',
        type: 'system',
        priority: 'medium'
      },
      {
        title: 'Welcome to KUFE Dashboard',
        message: 'Welcome to the Kandahar University Faculty of Economics Management System. All systems are operational.',
        type: 'system',
        priority: 'low'
      },
      {
        title: 'Database Backup Completed',
        message: 'Daily database backup has been completed successfully. All data is secure.',
        type: 'maintenance',
        priority: 'low'
      },
      {
        title: 'Security Update',
        message: 'System security protocols have been updated. All user sessions remain secure.',
        type: 'security',
        priority: 'medium'
      },
      {
        title: 'New Academic Year Preparation',
        message: 'System is ready for the new academic year. Please review course and student management settings.',
        type: 'announcement',
        priority: 'high'
      }
    ];

    // Create notifications for each admin
    for (const admin of adminUsers) {
      for (const notificationData of sampleNotifications) {
        await NotificationService.createNotification({
          ...notificationData,
          recipient: admin._id
        });
      }
    }

    console.log(`Created ${sampleNotifications.length} notifications for each admin user`);
    console.log('Sample notifications seeded successfully!');

  } catch (error) {
    console.error('Error seeding notifications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
if (require.main === module) {
  seedNotifications();
}

module.exports = seedNotifications;
