/**
 * Notifications API Service
 */

import client from './client';

/**
 * Get all notifications
 */
export const getNotifications = async ({ unread_only = false } = {}) => {
    const response = await client.get('/api/notifications', {
        params: { unread_only },
    });
    return response.data;
};

/**
 * Mark notification as read
 */
export const dismissNotification = async (notificationId) => {
    const response = await client.post(`/api/notifications/${notificationId}/dismiss`);
    return response.data;
};

/**
 * Mark all notifications as read
 */
export const dismissAllNotifications = async () => {
    const response = await client.post('/api/notifications/dismiss-all');
    return response.data;
};

/**
 * Get notification count
 */
export const getNotificationCount = async () => {
    const response = await client.get('/api/notifications/count');
    return response.data;
};

export default {
    getNotifications,
    dismissNotification,
    dismissAllNotifications,
    getNotificationCount,
};
