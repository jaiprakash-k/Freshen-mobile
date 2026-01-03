/**
 * Inventory API Service
 */

import client from './client';

/**
 * Get all inventory items with optional filters
 */
export const getItems = async ({ status = 'active', category, storage, search, limit = 50, offset = 0 } = {}) => {
    const params = { status, limit, offset };
    if (category) params.category = category;
    if (storage) params.storage = storage;
    if (search) params.search = search;

    const response = await client.get('/api/inventory', { params });
    return response.data;
};

/**
 * Get single item by ID
 */
export const getItem = async (itemId) => {
    const response = await client.get(`/api/inventory/${itemId}`);
    return response.data;
};

/**
 * Get items expiring within specified days
 */
export const getExpiringItems = async (days = 3) => {
    const response = await client.get('/api/inventory/expiring', { params: { days } });
    return response.data;
};

/**
 * Get expired items
 */
export const getExpiredItems = async () => {
    const response = await client.get('/api/inventory/expired');
    return response.data;
};

/**
 * Get inventory statistics
 */
export const getInventoryStats = async () => {
    const response = await client.get('/api/inventory/stats');
    return response.data;
};

/**
 * Create a new item
 */
export const createItem = async (itemData) => {
    const response = await client.post('/api/inventory', itemData);
    return response.data;
};

/**
 * Update an item
 */
export const updateItem = async (itemId, updates) => {
    const response = await client.put(`/api/inventory/${itemId}`, updates);
    return response.data;
};

/**
 * Delete an item
 */
export const deleteItem = async (itemId) => {
    const response = await client.delete(`/api/inventory/${itemId}`);
    return response.data;
};

/**
 * Mark item as consumed
 */
export const consumeItem = async (itemId, { quantity_consumed, notes } = {}) => {
    const response = await client.post(`/api/inventory/${itemId}/consume`, {
        quantity_consumed,
        notes,
    });
    return response.data;
};

/**
 * Mark item as wasted
 */
export const wasteItem = async (itemId, { reason = 'forgot', feedback_text } = {}) => {
    const response = await client.post(`/api/inventory/${itemId}/waste`, {
        reason,
        feedback_text,
    });
    return response.data;
};

/**
 * Scan receipt and parse items
 */
export const scanReceipt = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', {
        uri: imageFile.uri,
        type: 'image/jpeg',
        name: 'receipt.jpg',
    });

    const response = await client.post('/api/inventory/receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Confirm and add parsed receipt items
 */
export const confirmReceiptItems = async (items) => {
    const response = await client.post('/api/inventory/receipt/confirm', items);
    return response.data;
};

/**
 * Lookup product by barcode
 */
export const lookupBarcode = async (upc) => {
    const response = await client.get(`/api/inventory/barcode/${upc}`);
    return response.data;
};

export default {
    getItems,
    getItem,
    getExpiringItems,
    getExpiredItems,
    getInventoryStats,
    createItem,
    updateItem,
    deleteItem,
    consumeItem,
    wasteItem,
    scanReceipt,
    confirmReceiptItems,
    lookupBarcode,
};
