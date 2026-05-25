import * as db from '../db.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await db.findNotifications({ user: req.userId }, { limit: 50 });
    const unreadCount = await db.countNotifications({ user: req.userId, isRead: false });
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    await db.markNotificationsRead(req.userId, ids);
    res.json({ message: 'marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
