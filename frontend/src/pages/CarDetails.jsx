import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, AlertTriangle, ChevronRight, ChevronLeft, Star, PenTool, Maximize2, ArrowRight, ShoppingBag, MessageSquare, Info } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import FullScreenImageModal from '../components/FullScreenImageModal';
import LoadingScreen from '../components/LoadingScreen';
import { getCarById, getRelatedCars } from '../services/car.service';
import { addFavorite, removeFavorite, checkFavorite } from '../services/favorite.service';
import { getReviewsByCar, getCommonFaults, createReview } from '../services/review.service';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

    // Gallery State
    const [allPhotos, setAllPhotos] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    // New states for reviews and faults
    const [reviews, setReviews] = useState([]);
    const [commonFaults, setCommonFaults] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [activeVersionIndex, setActiveVersionIndex] = useState(0);
    const [relatedYears, setRelatedYears] = useState([]);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const tabsContainerRef = useRef(null);

    const scrollTabs = (direction) => {
        if (tabsContainerRef.current) {
            const scrollAmount = 200;
            tabsContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const fetchData = async () => {
        try {
            const [carData, reviewsData, faultsData] = await Promise.all([
                getCarById(id),
                getReviewsByCar(id),
                getCommonFaults(id)
            ]);

            setCar(carData);
            setReviews(reviewsData);
            setCommonFaults(faultsData);
            setActiveImage(carData.mainImageUrl);

            // Fetch related years
            try {
                const related = await getRelatedCars(carData.make, carData.model, id);
                setRelatedYears(related);
            } catch (err) {
                console.error("Error fetching related years:", err);
            }

            // Aggregate photos
            const officialPhotos = [
                { url: carData.mainImageUrl, type: 'official', caption: 'Principal' },
                ...(carData.photos || []).map(p => ({ ...p, type: 'official' }))
            ];

            const reviewPhotos = reviewsData.flatMap(r =>
                (r.photos || []).map(p => ({
                    ...p,
                    type: 'user',
                    user: r.user?.username,
                    caption: `Foto de ${r.user?.username || 'Usuario'}`
                }))
            );

            setAllPhotos([...officialPhotos, ...reviewPhotos]);

        } catch (err) {
            setError('Error al cargar los datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setActiveVersionIndex(0);
        setRelatedYears([]); // Reset to prevent phantom duplicates
        fetchData();
    }, [id]);

    useEffect(() => {
        const checkIfFavorited = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const result = await checkFavorite(id);
                setIsFavorite(result.isFavorite);
            } catch (error) {
                console.log('Error checking favorite:', error);
            }
        };

        if (id) {
            checkIfFavorited();
        }
    }, [id]);

    const handleReviewSubmit = async (reviewData) => {
        await createReview(reviewData);
        setShowReviewForm(false);
        // Refresh reviews and faults
        const [reviewsData, faultsData] = await Promise.all([
            getReviewsByCar(id),
            getCommonFaults(id)
        ]);
        setReviews(reviewsData);
        setCommonFaults(faultsData);

        // Re-aggregate photos
        const officialPhotos = [
            { url: car.mainImageUrl, type: 'official', caption: 'Principal' },
            ...(car.photos || []).map(p => ({ ...p, type: 'official' }))
        ];

        const reviewPhotos = reviewsData.flatMap(r =>
            (r.photos || []).map(p => ({
                ...p,
                type: 'user',
                user: r.user?.username,
                caption: `Foto de ${r.user?.username || 'Usuario'}`
            }))
        );

        setAllPhotos([...officialPhotos, ...reviewPhotos]);
    };

    const handleReviewDelete = (deletedReviewId) => {
        setReviews(prev => prev.filter(r => r.id !== deletedReviewId));
        // Refresh common faults as they might change
        getCommonFaults(id).then(setCommonFaults);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${car.make} ${car.model} - Reseñas y Fallas`,
                    text: `Mira las reseñas y fallas comunes del ${car.make} ${car.model} ${car.year}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Enlace copiado al portapapeles');
        }
    };

    const specTranslations = {
        transmissionType: 'Transmisión',
        transmission: 'Detalle de Transmisión',
        engine: 'Motor',
        horsepower: 'Caballos de Fuerza',
        torque: 'Torque',
        drivetrain: 'Tracción',
        fuelType: 'Combustible',
        fuelEconomy: 'Consumo / Eficiencia',
        batteryRange: 'Autonomía',
        acceleration0to100: 'Aceleración 0-100 km/h',
        mpg: 'Consumo (MPG)',
        seatingCapacity: 'Asientos',
        doors: 'Puertas',
        cargoCapacity: 'Capacidad de Carga',
        towingCapacity: 'Capacidad de Remolque',
        0: '0-60 mph',
        topSpeed: 'Velocidad Máxima'
    };

    const specExplanations = {
        transmissionType: 'Mecanismo que transmite la potencia del motor a las ruedas. Puede ser Manual (stick) o Automática.',
        transmission: 'Detalles específicos sobre la caja de cambios, como número de velocidades o tecnología (CVT, DSG, etc.).',
        engine: 'El corazón del auto. Define la cilindrada (tamaño) y configuración (V6, V8, 4 en línea) que genera la potencia.',
        horsepower: 'La potencia bruta del motor. Más caballos significan mayor velocidad máxima y capacidad de mantener velocidad.',
        torque: 'La fuerza de giro del motor. Un torque alto da mejor aceleración inicial y capacidad de remolque.',
        drivetrain: 'Indica qué ruedas reciben la potencia: FWD (Delantera), RWD (Trasera), AWD/4WD (Todas).',
        fuelType: 'El tipo de combustible que utiliza: Gasolina, Diesel, Híbrido o Eléctrico.',
        fuelEconomy: 'Eficiencia de combustible combinada. Cuántos kilómetros puedes recorrer por litro.',
        batteryRange: 'Distancia máxima que puede recorrer un vehículo eléctrico con una carga completa.',
        acceleration0to100: 'Tiempo que tarda en acelerar de 0 a 100 km/h. Menor tiempo indica mayor rapidez.',
        mpg: 'Millas por galón. Medida de eficiencia usada principalmente en EE.UU.',
        seatingCapacity: 'Número total de personas que pueden viajar sentadas con cinturón de seguridad.',
        doors: 'Número de puertas para acceso de pasajeros y carga.',
        cargoCapacity: 'Volumen del maletero o espacio de carga disponible.',
        towingCapacity: 'Peso máximo que el vehículo puede remolcar de manera segura.',
        topSpeed: 'La velocidad límite máxima que puede alcanzar el vehículo.'
    };

    // Helper function to add drivetrain descriptions
    const formatDrivetrainValue = (value) => {
        const drivetrainDescriptions = {
            'FWD': 'Delantera',
            'RWD': 'Trasera',
            'AWD': 'Tracción Total',
            '4WD': 'Tracción Integral',
            '4x4': 'Tracción Integral',
            '4X4': 'Tracción Integral'
        };

        const upperValue = value?.toString().toUpperCase();
        const description = drivetrainDescriptions[upperValue];

        return description ? `${value} (${description})` : value;
    };

    if (loading) return <LoadingScreen message="Cargando detalles del auto" />;
    if (error) return <div className="min-h-screen pt-24 text-center text-red-500">{error}</div>;
    if (!car) return <div className="min-h-screen pt-24 text-center text-white">Auto no encontrado</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gray-50 dark:bg-dark-bg transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-secondary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-1 p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <span>{car.make}</span>
                                <ChevronRight className="h-4 w-4" />
                                <span>{car.model}</span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-primary-600 dark:text-primary-400 font-medium">{car.year}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">{car.make} {car.model}</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">{car.version}</p>

                            {/* Year Navigation Chips */}
                            {relatedYears.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Modelos Disponibles</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[...relatedYears.filter(y => y.id !== car.id), { id: car.id, year: car.year, version: car.version }]
                                            .sort((a, b) => b.year - a.year)
                                            .map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => item.id !== car.id && navigate(`/car/${item.id}`)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${item.id === car.id
                                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105 cursor-default'
                                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-700'
                                                        }`}
                                                >
                                                    {item.year}
                                                    {item.id === car.id && (
                                                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-normal">ACTUAL</span>
                                                    )}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem('token');
                                if (!token) {
                                    navigate('/login');
                                    return;
                                }

                                try {
                                    if (isFavorite) {
                                        await removeFavorite(id);
                                        setIsFavorite(false);
                                    } else {
                                        await addFavorite(id);
                                        setIsFavorite(true);
                                    }
                                } catch (error) {
                                    console.error('Error toggling favorite:', error);
                                    if (error.response?.status === 401) {
                                        navigate('/login');
                                    }
                                }
                            }}
                            className={`p-3 rounded-full border transition-all ${isFavorite ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900/30' : 'bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 dark:hover:text-red-400'}`}
                        >
                            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-3 rounded-full border bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-all"
                        >
                            <Share2 className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Gallery & Specs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Gallery */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden h-[400px] shadow-2xl relative group">
                            <img
                                src={activeImage || car.mainImageUrl}
                                alt="Main"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                                onClick={() => {
                                    const index = allPhotos.findIndex(p => p.url === activeImage);
                                    setCurrentPhotoIndex(index >= 0 ? index : 0);
                                    setIsFullScreen(true);
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Navigation Arrows */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = allPhotos.findIndex(p => p.url === activeImage);
                                    const prevIndex = (currentIndex - 1 + allPhotos.length) % allPhotos.length;
                                    setActiveImage(allPhotos[prevIndex].url);
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = allPhotos.findIndex(p => p.url === activeImage);
                                    const nextIndex = (currentIndex + 1) % allPhotos.length;
                                    setActiveImage(allPhotos[nextIndex].url);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>

                            {/* Full Screen Hint */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        const index = allPhotos.findIndex(p => p.url === activeImage);
                                        setCurrentPhotoIndex(index >= 0 ? index : 0);
                                        setIsFullScreen(true);
                                    }}
                                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                                >
                                    <Maximize2 className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Image Info Overlay */}
                            {allPhotos.find(p => p.url === activeImage)?.type === 'user' && (
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-2">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    Foto de la comunidad
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {allPhotos.map((photo, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImage(photo.url)}
                                    className={`flex-shrink-0 w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all ${activeImage === photo.url ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={photo.url} alt={photo.caption || 'Thumbnail'} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Specs */}
                    <div>
                        {/* Version Tabs (Browser Style) */}
                        {car.versions && car.versions.length > 0 && (
                            <div className="relative z-10 group">
                                <div
                                    ref={tabsContainerRef}
                                    className="flex gap-2 px-4 overflow-x-auto scrollbar-hide -mb-px"
                                >
                                    {car.versions.map((v, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveVersionIndex(idx)}
                                            className={`px-6 py-3 rounded-t-2xl text-sm font-bold transition-all relative ${activeVersionIndex === idx
                                                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-primary-600 dark:text-primary-400 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'
                                                : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {v.name}
                                            {activeVersionIndex === idx && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/80 dark:bg-slate-900/80"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => scrollTabs('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-800/80 p-2 rounded-full shadow-lg text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 backdrop-blur-sm z-30 translate-x-1/2"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        <div className={`glass-card p-6 rounded-3xl ${car.versions && car.versions.length > 0 ? 'rounded-tl-none' : ''}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <PenTool className="h-5 w-5 text-primary-500" />
                                    <span className="text-gray-900 dark:text-white">Especificaciones</span>
                                </h2>

                            </div>

                            <dl className="space-y-4">
                                {(car.versions && car.versions.length > 0 ? car.versions[activeVersionIndex].specs : car.specs) &&
                                    Object.entries((car.versions && car.versions.length > 0 ? car.versions[activeVersionIndex].specs : car.specs))
                                        .filter(([key, value]) => {
                                            // Filter out isElectric and empty values
                                            if (key === 'isElectric') return false;
                                            if (value === null || value === undefined || value === '') return false;
                                            return true;
                                        })
                                        .map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                                                <dt className="text-gray-500 dark:text-gray-400 capitalize text-sm flex items-center gap-1.5 relative">
                                                    {specTranslations[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                                                    {specExplanations[key] && (
                                                        <div
                                                            className="relative flex items-center"
                                                            onMouseEnter={() => setActiveTooltip(key)}
                                                            onMouseLeave={() => setActiveTooltip(null)}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTooltip(activeTooltip === key ? null : key);
                                                            }}
                                                        >
                                                            <Info
                                                                className={`h-3.5 w-3.5 cursor-help transition-colors ${activeTooltip === key ? 'text-primary-500' : 'text-gray-400 hover:text-primary-500'}`}
                                                            />
                                                            {activeTooltip === key && (
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 md:w-64 bg-gray-900 dark:bg-gray-800 text-white text-xs p-3 rounded-xl shadow-xl z-50 text-center leading-relaxed animate-fade-in">
                                                                    {specExplanations[key]}
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </dt>
                                                <dd className="font-semibold text-gray-900 dark:text-white text-right">
                                                    {key === 'drivetrain' ? formatDrivetrainValue(value) : value}
                                                </dd>
                                            </div>
                                        ))}
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Fallas Comunes & Cotizar/Comprar Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="glass-card p-6 rounded-3xl border-l-4 border-yellow-400 dark:border-yellow-500">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                            Fallas Comunes
                        </h2>
                        <ul className="space-y-3">
                            {commonFaults.length > 0 ? commonFaults.map((fault, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl">
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">{fault.name}</span>
                                    <span className="bg-white dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                        {fault.count} reportes
                                    </span>
                                </li>
                            )) : (
                                <li className="text-gray-500 dark:text-gray-400">No hay reportes de fallas comunes.</li>
                            )}
                        </ul>
                    </div>
                    <div className="glass-card p-6 rounded-3xl border-l-4 border-green-500">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
                            <ShoppingBag className="h-6 w-6 text-green-500 mr-2" />
                            Cotizar / Comprar
                        </h2>
                        <div className="space-y-3">
                            {car.chileautosUrl ? (
                                <a
                                    href={car.chileautosUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full p-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 group"
                                >
                                    <span className="font-bold">Ver en Chileautos</span>
                                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                </a>
                            ) : null}

                            {car.marketplaceUrl ? (
                                <a
                                    href={car.marketplaceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 group"
                                >
                                    <span className="font-bold">Ver en Marketplace</span>
                                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                </a>
                            ) : null}

                            {!car.chileautosUrl && !car.marketplaceUrl && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                    No hay enlaces de compra disponibles por el momento.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="glass-card rounded-3xl p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageSquare className="h-6 w-6 text-primary-500 fill-current" />
                                Reseñas de la Comunidad
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Descubre lo que dicen los dueños reales</p>
                        </div>
                        {!showReviewForm && (
                            <button
                                onClick={() => {
                                    const token = localStorage.getItem('token');
                                    if (!token) {
                                        navigate('/login');
                                    } else {
                                        setShowReviewForm(true);
                                    }
                                }}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5"
                            >
                                Escribir Reseña
                            </button>
                        )}
                    </div>

                    {
                        showReviewForm && (
                            <div className="mb-8">
                                <ReviewForm
                                    carId={id}
                                    onSubmit={handleReviewSubmit}
                                    onCancel={() => setShowReviewForm(false)}
                                />
                            </div>
                        )
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.length > 0 ? reviews.map(review => (
                            <ReviewCard key={review.id} review={review} onDelete={handleReviewDelete} />
                        )) : (
                            <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">No hay reseñas aún. ¡Sé el primero en opinar!</p>
                        )}
                    </div>
                </div>
                <FullScreenImageModal
                    isOpen={isFullScreen}
                    onClose={() => setIsFullScreen(false)}
                    images={allPhotos}
                    initialIndex={currentPhotoIndex}
                />
            </div>
        </div >
    );
};

export default CarDetails;
