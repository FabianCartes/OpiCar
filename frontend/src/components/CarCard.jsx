import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Fuel, Settings, Calendar } from 'lucide-react';
import { addFavorite, removeFavorite, checkFavorite } from '../services/favorite.service';

const CarCard = ({ car }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfFavorited = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const result = await checkFavorite(car.id);
                setIsFavorite(result.isFavorite);
            } catch (error) {
                // User not authenticated or error checking
                console.log('Error checking favorite:', error);
            }
        };

        checkIfFavorited();
    }, [car.id]);

    const handleFavoriteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorite) {
                await removeFavorite(car.id);
                setIsFavorite(false);
            } else {
                await addFavorite(car.id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {car.mainImageUrl ? (
                    <img
                        src={car.mainImageUrl}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <span className="text-sm font-medium">Sin Imagen</span>
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={handleFavoriteClick}
                        disabled={isLoading}
                        className={`p-2 backdrop-blur-sm rounded-full shadow-sm transition-all group/btn ${isFavorite
                            ? 'bg-red-50/90 dark:bg-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/70'
                            : 'bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black'
                            }`}
                    >
                        <Heart className={`h-5 w-5 transition-colors ${isFavorite
                            ? 'text-red-500 fill-current'
                            : 'text-gray-400 dark:text-gray-300 group-hover/btn:text-red-500'
                            }`} />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium line-clamp-1">{car.description}</p>
                </div>
            </div>

            <div className="p-5">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{car.make} {car.model}</h3>
                    <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">{car.version}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Settings className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>{car.specs?.transmissionType || car.specs?.transmission || 'N/A'}</span>
                    </div>
                </div>

                <Link
                    to={`/car/${car.id}`}
                    className="block w-full text-center bg-gray-50 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 py-2.5 rounded-xl font-medium transition-all hover:border-primary-500 dark:hover:border-primary-500/50"
                >
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
};

export default CarCard;
