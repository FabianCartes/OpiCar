import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import CarCard from '../components/CarCard';
import LoadingScreen from '../components/LoadingScreen';
import { getFavorites } from '../services/favorite.service';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const data = await getFavorites();
                setFavorites(data);
            } catch (err) {
                console.error('Error fetching favorites:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Error al cargar favoritos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [navigate]);

    if (loading) {
        return <LoadingScreen message="Cargando favoritos" />;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50 dark:bg-dark-bg">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gray-50 dark:bg-dark-bg transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-secondary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/search')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Volver a Búsqueda
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Heart className="h-8 w-8 text-red-500 fill-current" />
                        Mis Favoritos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tus autos guardados para revisar más tarde
                    </p>
                </div>

                {error ? (
                    <div className="glass-card p-8 rounded-3xl text-center">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 rounded-3xl text-center">
                        <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No tienes favoritos aún
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Explora autos y guarda tus favoritos haciendo clic en el corazón
                        </p>
                        <button
                            onClick={() => navigate('/search')}
                            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Explorar Autos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
