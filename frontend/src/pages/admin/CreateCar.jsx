import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { createCar } from '../../services/car.service';
import CarForm from '../../components/admin/CarForm';

const CreateCar = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (carData) => {
        setLoading(true);
        setError('');

        try {
            await createCar(carData);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el auto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic uppercase">
                        Crear Nuevo Auto
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Completa la información para publicar un auto en la plataforma
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-6">
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                <CarForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </AdminLayout>
    );
};

export default CreateCar;
