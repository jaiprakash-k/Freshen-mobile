/**
 * App-wide Context
 * Manages inventory, notifications, and global app state
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { inventoryApi, notificationsApi, analyticsApi } from '../api';

// Initial state
const initialState = {
    items: [],
    expiringItems: [],
    stats: null,
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
};

// Action types
const APP_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ITEMS: 'SET_ITEMS',
    SET_EXPIRING: 'SET_EXPIRING',
    SET_STATS: 'SET_STATS',
    ADD_ITEM: 'ADD_ITEM',
    UPDATE_ITEM: 'UPDATE_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
    SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
    SET_ERROR: 'SET_ERROR',
};

// Reducer
function appReducer(state, action) {
    switch (action.type) {
        case APP_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case APP_ACTIONS.SET_ITEMS:
            return { ...state, items: action.payload, isLoading: false };
        case APP_ACTIONS.SET_EXPIRING:
            return { ...state, expiringItems: action.payload };
        case APP_ACTIONS.SET_STATS:
            return { ...state, stats: action.payload };
        case APP_ACTIONS.ADD_ITEM:
            return { ...state, items: [action.payload, ...state.items] };
        case APP_ACTIONS.UPDATE_ITEM:
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };
        case APP_ACTIONS.REMOVE_ITEM:
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };
        case APP_ACTIONS.SET_NOTIFICATIONS:
            return { ...state, notifications: action.payload };
        case APP_ACTIONS.SET_UNREAD_COUNT:
            return { ...state, unreadCount: action.payload };
        case APP_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };
        default:
            return state;
    }
}

// Create context
const AppContext = createContext(undefined);

// Provider component
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Fetch inventory items
    const fetchItems = useCallback(async (filters = {}) => {
        try {
            dispatch({ type: APP_ACTIONS.SET_LOADING, payload: true });
            const response = await inventoryApi.getItems(filters);
            dispatch({ type: APP_ACTIONS.SET_ITEMS, payload: response.data || [] });
        } catch (error) {
            dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, []);

    // Fetch expiring items
    const fetchExpiringItems = useCallback(async (days = 3) => {
        try {
            const response = await inventoryApi.getExpiringItems(days);
            dispatch({ type: APP_ACTIONS.SET_EXPIRING, payload: response.data || [] });
        } catch (error) {
            console.error('Failed to fetch expiring items:', error);
        }
    }, []);

    // Fetch inventory stats
    const fetchStats = useCallback(async () => {
        try {
            const response = await inventoryApi.getInventoryStats();
            dispatch({ type: APP_ACTIONS.SET_STATS, payload: response.data });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, []);

    // Add new item
    const addItem = useCallback(async (itemData) => {
        try {
            const response = await inventoryApi.createItem(itemData);
            dispatch({ type: APP_ACTIONS.ADD_ITEM, payload: response });
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    // Update item
    const updateItem = useCallback(async (itemId, updates) => {
        try {
            const response = await inventoryApi.updateItem(itemId, updates);
            dispatch({ type: APP_ACTIONS.UPDATE_ITEM, payload: response });
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    // Remove item
    const removeItem = useCallback(async (itemId) => {
        try {
            await inventoryApi.deleteItem(itemId);
            dispatch({ type: APP_ACTIONS.REMOVE_ITEM, payload: itemId });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    // Consume item
    const consumeItem = useCallback(async (itemId, data) => {
        try {
            const response = await inventoryApi.consumeItem(itemId, data);
            dispatch({ type: APP_ACTIONS.UPDATE_ITEM, payload: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    // Waste item
    const wasteItem = useCallback(async (itemId, data) => {
        try {
            const response = await inventoryApi.wasteItem(itemId, data);
            dispatch({ type: APP_ACTIONS.UPDATE_ITEM, payload: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        try {
            const response = await notificationsApi.getNotifications();
            dispatch({ type: APP_ACTIONS.SET_NOTIFICATIONS, payload: response.data || [] });
            const unread = (response.data || []).filter((n) => !n.read).length;
            dispatch({ type: APP_ACTIONS.SET_UNREAD_COUNT, payload: unread });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, []);

    const value = {
        ...state,
        fetchItems,
        fetchExpiringItems,
        fetchStats,
        addItem,
        updateItem,
        removeItem,
        consumeItem,
        wasteItem,
        fetchNotifications,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook
export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export default AppContext;
