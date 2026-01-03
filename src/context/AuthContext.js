/**
 * Authentication Context
 * Manages user auth state across the app
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../api';
import { getAccessToken } from '../api/client';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Action types
const AUTH_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
function authReducer(state, action) {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };
        case AUTH_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };
        default:
            return state;
    }
}

// Create context
const AuthContext = createContext(undefined);

// Provider component
export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing auth on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const token = await getAccessToken();

            if (token) {
                const response = await authApi.getCurrentUser();
                if (response.success && response.data) {
                    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: response.data });
                } else {
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } else {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
        } catch (error) {
            console.log('Auth check failed:', error);
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    const login = async (email, password) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await authApi.login({ email, password });

            if (response.success && response.user) {
                dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: response.user });
                return { success: true };
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            const message = error.response?.data?.detail || error.message || 'Login failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
            return { success: false, error: message };
        }
    };

    const signup = async (name, email, password) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await authApi.signup({ name, email, password });

            if (response.success && response.user) {
                dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: response.user });
                return { success: true };
            } else {
                throw new Error(response.message || 'Signup failed');
            }
        } catch (error) {
            const message = error.response?.data?.detail || error.message || 'Signup failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        await authApi.logout();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    const value = {
        ...state,
        login,
        signup,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
