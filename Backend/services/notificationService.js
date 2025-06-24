const Notification = require("../models/Notification");
const User = require("../models/User");

class NotificationService {
  // Create notification for specific user
  static async createNotification({
    title,
    message,
    type = 'general',
    priority = 'medium',
    recipient,
    sender = null,
    actionUrl = null,
    data = null
  }) {
    try {
      const notification = await Notification.create({
        title,
        message,
        type,
        priority,
        recipient,
        sender,
        actionUrl,
        data
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notification for all admins
  static async notifyAllAdmins({
    title,
    message,
    type = 'system',
    priority = 'medium',
    sender = null,
    actionUrl = null,
    data = null
  }) {
    try {
      const adminUsers = await User.find({ role: 'admin' }).select('_id');
      
      const notifications = await Promise.all(
        adminUsers.map(admin => 
          this.createNotification({
            title,
            message,
            type,
            priority,
            recipient: admin._id,
            sender,
            actionUrl,
            data
          })
        )
      );

      return notifications;
    } catch (error) {
      console.error('Error notifying all admins:', error);
      throw error;
    }
  }

  // Notify about new user registration
  static async notifyUserRegistration(newUser) {
    return this.notifyAllAdmins({
      title: 'New User Registration',
      message: `${newUser.fullName} (${newUser.role}) has registered for the system`,
      type: 'user_registration',
      priority: 'medium',
      actionUrl: '/dashboardv1?tab=students',
      data: { userId: newUser._id, userRole: newUser.role }
    });
  }

  // Notify about course updates
  static async notifyCourseUpdate(course, action = 'updated') {
    return this.notifyAllAdmins({
      title: `Course ${action}`,
      message: `Course "${course.name}" has been ${action}`,
      type: 'course_update',
      priority: 'medium',
      actionUrl: '/dashboardv1?tab=courses',
      data: { courseId: course._id, action }
    });
  }

  // Notify about research submission
  static async notifyResearchSubmission(research, student) {
    return this.notifyAllAdmins({
      title: 'New Research Submission',
      message: `${student.name} has submitted research: "${research.title}"`,
      type: 'research_submission',
      priority: 'high',
      actionUrl: '/admin-research-view',
      data: { researchId: research._id, studentId: student._id }
    });
  }

  // Notify about research review
  static async notifyResearchReview(research, reviewer, status) {
    // Notify the student
    if (research.student_id) {
      await this.createNotification({
        title: 'Research Review Update',
        message: `Your research "${research.title}" has been ${status}`,
        type: 'research_review',
        priority: 'high',
        recipient: research.student_id,
        sender: reviewer._id,
        actionUrl: '/student-research-submission',
        data: { researchId: research._id, status }
      });
    }

    // Notify admins
    return this.notifyAllAdmins({
      title: 'Research Review Completed',
      message: `Research "${research.title}" has been ${status} by ${reviewer.fullName}`,
      type: 'research_review',
      priority: 'medium',
      actionUrl: '/admin-research-view',
      data: { researchId: research._id, reviewerId: reviewer._id, status }
    });
  }

  // Notify about marks added
  static async notifyMarksAdded(student, subject, semester) {
    return this.createNotification({
      title: 'New Marks Added',
      message: `Your marks for ${subject.name} in ${semester.name} have been recorded`,
      type: 'marks_added',
      priority: 'medium',
      recipient: student._id,
      actionUrl: '/marks-management',
      data: { subjectId: subject._id, semesterId: semester._id }
    });
  }

  // Notify about new events
  static async notifyEventCreated(event) {
    return this.notifyAllAdmins({
      title: 'New Event Created',
      message: `Event "${event.title}" has been scheduled for ${new Date(event.date).toLocaleDateString()}`,
      type: 'event_created',
      priority: 'medium',
      actionUrl: '/dashboardv1?tab=events',
      data: { eventId: event._id }
    });
  }

  // Notify about system maintenance
  static async notifySystemMaintenance(message, scheduledTime = null) {
    return this.notifyAllAdmins({
      title: 'System Maintenance',
      message: scheduledTime 
        ? `${message} Scheduled for: ${new Date(scheduledTime).toLocaleString()}`
        : message,
      type: 'maintenance',
      priority: 'high',
      data: { scheduledTime }
    });
  }

  // Notify about security alerts
  static async notifySecurityAlert(message, severity = 'medium') {
    return this.notifyAllAdmins({
      title: 'Security Alert',
      message,
      type: 'security',
      priority: severity === 'critical' ? 'urgent' : 'high',
      data: { severity }
    });
  }

  // Clean up old notifications (can be called by a cron job)
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        read: true
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
