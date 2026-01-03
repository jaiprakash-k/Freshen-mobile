/**
 * Authentication API Service
 */

import client, { storeTokens, clearTokens } from './client';

/**
 * Register a new user
 */
export const signup = async ({ email, password, name, timezone = 'UTC' }) => {
    const response = await client.post('/api/auth/signup', {
        email,
        password,
        name,
        timezone,
    });

    if (response.data.access_token) {
        await storeTokens(response.data.access_token, response.data.refresh_token);
    }

    return response.data;
};

/**
 * Login existing user
 */
export const login = async ({ email, password }) => {
    const response = await client.post('/api/auth/login', {
        email,
        password,
    });

    if (response.data.access_token) {
        await storeTokens(response.data.access_token, response.data.refresh_token);
    }

    return response.data;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
    const response = await client.get('/api/auth/me');
    return response.data;
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken) => {
    const response = await client.post('/api/auth/refresh', {
        refresh_token: refreshToken,
    });

    if (response.data.access_token) {
        await storeTokens(response.data.access_token, response.data.refresh_token);
    }

    return response.data;
};

/**
 * Logout - clear tokens
 */
export const logout = async () => {
    await clearTokens();
};

export default {
    signup,
    login,
    getCurrentUser,
    refreshToken,
    logout,
};
