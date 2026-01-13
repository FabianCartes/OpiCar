import api from './api';

export const createFeedback = async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
};

export const getFeedbacks = async () => {
    const response = await api.get('/feedback');
    return response.data;
};
