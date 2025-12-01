import api from './api';

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Users
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Reports
export const getReportedReviews = async () => {
    try {
        const response = await api.get('/reviews/reports');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const dismissReport = async (reportId) => {
    try {
        const response = await api.patch(`/reviews/reports/${reportId}/dismiss`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteReviewFromReport = async (reportId) => {
    try {
        const response = await api.delete(`/reviews/reports/${reportId}/review`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
