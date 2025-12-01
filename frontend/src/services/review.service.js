import api from './api';

export const createReview = async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
};

export const getReviewsByCar = async (carId) => {
    const response = await api.get(`/reviews/car/${carId}`);
    return response.data;
};

export const getCommonFaults = async (carId) => {
    const response = await api.get(`/reviews/car/${carId}/faults`);
    return response.data;
};

export const toggleReaction = async (reviewId, type) => {
    const response = await api.post(`/reviews/${reviewId}/reaction`, { type });
    return response.data;
};

export const reportReview = async (reviewId, reason, details) => {
    const response = await api.post(`/reviews/${reviewId}/report`, { reason, details });
    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
