/**
 * FreshKeep API Client
 * Axios instance with authentication interceptors
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// API Base URL Configuration
// Priority: Environment variable > Platform-specific default
const getApiBaseUrl = () => {
    // ⚠️ SET THIS TO TRUE when testing on a physical device
    const USE_LOCAL_IP = true;

    // Your computer's local network IP - UPDATE THIS if your IP changes
    const LOCAL_NETWORK_IP = '10.156.84.241';

    // Force local IP for physical device testing
    if (USE_LOCAL_IP) {
        return `http://${LOCAL_NETWORK_IP}:8000`;
    }

    // Check for environment variable first (from app.json extra or .env)
    const envUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
        return envUrl;
    }

    // Platform-specific defaults for development
    if (__DEV__) {
        if (Platform.OS === 'android') {
            // Android emulator uses 10.0.2.2 to access host machine's localhost
            return 'http://10.0.2.2:8000';
        } else if (Platform.OS === 'ios') {
            // iOS simulator can use localhost
            return 'http://localhost:8000';
        }
    }

    // Fallback
    return `http://${LOCAL_NETWORK_IP}:8000`;
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL in development for debugging
if (__DEV__) {
    console.log('🌐 Freshen API URL:', API_BASE_URL);
}

// Export for debugging purposes
export const getApiUrl = () => API_BASE_URL;

// Create axios instance
const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token storage keys
const ACCESS_TOKEN_KEY = 'freshkeep_access_token';
const REFRESH_TOKEN_KEY = 'freshkeep_refresh_token';

/**
 * Get stored access token
 */
export const getAccessToken = async () => {
    try {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = async () => {
    try {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

/**
 * Store tokens securely
 */
export const storeTokens = async (accessToken, refreshToken) => {
    try {
        // SecureStore requires string values - check for null/undefined
        if (accessToken && typeof accessToken === 'string') {
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        }
        if (refreshToken && typeof refreshToken === 'string') {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        }
    } catch (error) {
        console.error('Error storing tokens:', error);
    }
};

/**
 * Clear stored tokens
 */
export const clearTokens = async () => {
    try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error clearing tokens:', error);
    }
};

// Request interceptor - add auth token
client.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token refresh
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                        refresh_token: refreshToken,
                    });

                    const { access_token, refresh_token } = response.data;
                    await storeTokens(access_token, refresh_token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return client(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clear tokens and reject
                await clearTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
