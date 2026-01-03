/**
 * Family API Service
 */

import client from './client';

/**
 * Create a new family group
 */
export const createFamily = async ({ name }) => {
    const response = await client.post('/api/family', { name });
    return response.data;
};

/**
 * Join existing family using invite code
 */
export const joinFamily = async ({ invite_code }) => {
    const response = await client.post('/api/family/join', { invite_code });
    return response.data;
};

/**
 * Get family members
 */
export const getFamilyMembers = async () => {
    const response = await client.get('/api/family/members');
    return response.data;
};

/**
 * Update member permissions
 */
export const updateMemberPermissions = async (memberId, { role }) => {
    const response = await client.put(`/api/family/members/${memberId}`, { role });
    return response.data;
};

/**
 * Remove member from family
 */
export const removeFamilyMember = async (memberId) => {
    const response = await client.delete(`/api/family/members/${memberId}`);
    return response.data;
};

/**
 * Leave family
 */
export const leaveFamily = async () => {
    const response = await client.post('/api/family/leave');
    return response.data;
};

/**
 * Get new invite code
 */
export const refreshInviteCode = async () => {
    const response = await client.post('/api/family/invite-code');
    return response.data;
};

export default {
    createFamily,
    joinFamily,
    getFamilyMembers,
    updateMemberPermissions,
    removeFamilyMember,
    leaveFamily,
    refreshInviteCode,
};
