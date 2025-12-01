import api from './api';

export const addFavorite = async (carId) => {
    const response = await api.post('/favorites', { carId });
    return response.data;
};

export const removeFavorite = async (carId) => {
    const response = await api.delete(`/favorites/${carId}`);
    return response.data;
};

export const getFavorites = async () => {
    const response = await api.get('/favorites');
    return response.data;
};

export const checkFavorite = async (carId) => {
    const response = await api.get(`/favorites/check/${carId}`);
    return response.data;
};
