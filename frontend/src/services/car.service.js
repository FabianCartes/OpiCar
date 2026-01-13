import api from './api';

export const getCars = async () => {
    const response = await api.get('/cars');
    return response.data;
};

export const getCarById = async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
};

export const createCar = async (carData) => {
    const response = await api.post('/cars', carData);
    return response.data;
};

export const updateCar = async (id, carData) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
};

export const deleteCar = async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
};

export const getPopularCars = async (limit = 3) => {
    const response = await api.get(`/cars/popular?limit=${limit}`);
    return response.data;
};

export const getRelatedCars = async (make, model, currentId) => {
    const response = await api.get('/cars/related', {
        params: { make, model, currentId }
    });
    return response.data;
};
