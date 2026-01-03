/**
 * Analytics API Service
 */

import client from './client';

/**
 * Get analytics summary
 */
export const getSummary = async ({ period = '7d' } = {}) => {
    const response = await client.get('/api/analytics/summary', {
        params: { period },
    });
    return response.data;
};

/**
 * Get AI-powered insights and tips
 */
export const getInsights = async () => {
    const response = await client.get('/api/analytics/insights');
    return response.data;
};

/**
 * Get user achievements
 */
export const getAchievements = async () => {
    const response = await client.get('/api/analytics/achievements');
    return response.data;
};

export default {
    getSummary,
    getInsights,
    getAchievements,
};
