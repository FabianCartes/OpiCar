import api from './api';

export const getUserProfileStats = async () => {
    try {
        const response = await api.get('/users/profile/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserProfileReviews = async () => {
    try {
        const response = await api.get('/users/profile/reviews');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPublicUserProfile = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPublicUserStats = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/stats`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
