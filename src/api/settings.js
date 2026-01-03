/**
 * Settings API Service
 */

import client from './client';

/**
 * Get user settings
 */
export const getSettings = async () => {
    const response = await client.get('/api/settings');
    return response.data;
};

/**
 * Update user settings
 */
export const updateSettings = async (settings) => {
    const response = await client.put('/api/settings', settings);
    return response.data;
};

/**
 * Update notification preferences
 */
export const updateNotificationSettings = async (notificationSettings) => {
    const response = await client.put('/api/settings/notifications', notificationSettings);
    return response.data;
};

/**
 * Update food preferences (dietary, allergies)
 */
export const updateFoodPreferences = async (foodSettings) => {
    const response = await client.put('/api/settings/food', foodSettings);
    return response.data;
};

export default {
    getSettings,
    updateSettings,
    updateNotificationSettings,
    updateFoodPreferences,
};
