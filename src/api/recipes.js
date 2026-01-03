/**
 * Recipe API Service
 */

import client from './client';

/**
 * Get recipe recommendations based on inventory
 */
export const getRecipes = async ({ limit = 10, prioritize_expiring = true } = {}) => {
    const response = await client.get('/api/recipes', {
        params: { limit, prioritize_expiring },
    });
    return response.data;
};

/**
 * Get detailed recipe information
 */
export const getRecipeDetail = async (recipeId) => {
    const response = await client.get(`/api/recipes/${recipeId}`);
    return response.data;
};

/**
 * Search recipes by ingredients
 */
export const searchRecipes = async ({ ingredients = [], cuisine, diet } = {}) => {
    const response = await client.get('/api/recipes/search', {
        params: {
            ingredients: ingredients.join(','),
            cuisine,
            diet,
        },
    });
    return response.data;
};

export default {
    getRecipes,
    getRecipeDetail,
    searchRecipes,
};
