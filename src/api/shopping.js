/**
 * Shopping List API Service
 */

import client from './client';

/**
 * Get shopping list
 */
export const getShoppingList = async () => {
    const response = await client.get('/api/shopping-list');
    return response.data;
};

/**
 * Add item to shopping list
 */
export const addShoppingItem = async ({ name, quantity = 1, unit = 'piece', category, notes }) => {
    const response = await client.post('/api/shopping-list', {
        name,
        quantity,
        unit,
        category,
        notes,
    });
    return response.data;
};

/**
 * Update shopping item (toggle checked, update quantity, etc.)
 */
export const updateShoppingItem = async (itemId, updates) => {
    const response = await client.put(`/api/shopping-list/${itemId}`, updates);
    return response.data;
};

/**
 * Delete shopping item
 */
export const deleteShoppingItem = async (itemId) => {
    const response = await client.delete(`/api/shopping-list/${itemId}`);
    return response.data;
};

/**
 * Clear checked items
 */
export const clearCheckedItems = async () => {
    const response = await client.delete('/api/shopping-list/checked');
    return response.data;
};

export default {
    getShoppingList,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    clearCheckedItems,
};
