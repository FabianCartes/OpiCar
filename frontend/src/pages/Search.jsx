import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import LoadingScreen from '../components/LoadingScreen';
import { Filter, Heart } from 'lucide-react';
import { getCars } from '../services/car.service';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch cars from API
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const data = await getCars();
                setCars(data);
                setFilteredCars(data);
            } catch (err) {
                console.error('Error fetching cars:', err);
                setError('Error al cargar los autos');
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    // Filter cars based on search params
    useEffect(() => {
        const make = searchParams.get('make')?.toLowerCase();
        const model = searchParams.get('model')?.toLowerCase();
        const year = searchParams.get('year');

        const filtered = cars.filter(car => {
            const matchMake = make ? car.make.toLowerCase().includes(make) : true;
            const matchModel = model ? car.model.toLowerCase().includes(model) : true;
            const matchYear = year ? car.year.toString() === year : true;
            return matchMake && matchModel && matchYear;
        });
        setFilteredCars(filtered);
    }, [searchParams, cars]);

    const handleSearch = (params) => {
        setSearchParams(params);
    };

    if (loading) {
        return <LoadingScreen message="Buscando autos" />;
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
                <div className="mb-8 relative z-20">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Filter className="h-8 w-8 text-primary-500" />
                            Resultados de Búsqueda
                        </h1>
                        {localStorage.getItem('token') && (
                            <Link
                                to="/favorites"
                                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-0.5"
                            >
                                <Heart className="h-5 w-5 fill-current" />
                                Mis Favoritos
                            </Link>
                        )}
                    </div>
                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>

                {error ? (
                    <div className="glass-card p-8 rounded-3xl text-center">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCars.length > 0 ? (
                            filteredCars.map(car => (
                                <CarCard key={car.id} car={car} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 glass-card rounded-3xl">
                                <p className="text-xl text-gray-500 dark:text-gray-400">No se encontraron autos con esos criterios.</p>
                                <button
                                    onClick={() => setSearchParams({})}
                                    className="mt-4 text-primary-600 dark:text-primary-400 hover:underline font-medium"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
