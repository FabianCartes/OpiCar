import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Calendar, MessageSquare, Star } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import LoadingScreen from '../components/LoadingScreen';
import { getUserProfileStats, getUserProfileReviews } from '../services/user.service';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        reviewsCount: 0,
        favoritesCount: 0,
        likesCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const [statsData, reviewsData] = await Promise.all([
                    getUserProfileStats(),
                    getUserProfileReviews()
                ]);
                setStats(statsData);
                setReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Debes iniciar sesión para ver tu perfil.</p>
            </div>
        );
    }

    if (loading) {
        return <LoadingScreen message="Cargando tu perfil" />;
    }

    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gray-50 dark:bg-dark-bg transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-secondary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* User Info Card */}
                <div className="glass-card p-8 rounded-3xl shadow-2xl mb-12 border-t border-white/50 dark:border-white/10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary-600/30">
                                {getInitials(user.username)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-green-500 rounded-full border-4 border-white dark:border-dark-bg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic uppercase tracking-tight">
                                {user.username}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 justify-center md:justify-start">
                                    <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    <span className="font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 justify-center md:justify-start">
                                    <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    <span className="font-medium">Miembro desde {new Date(user.created_at || Date.now()).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-black text-primary-600 dark:text-primary-400">{stats.reviewsCount}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Reseñas</div>
                                </div>
                                <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-black text-secondary-600 dark:text-secondary-400">{stats.favoritesCount}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Favoritos</div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-black text-green-600 dark:text-green-400">{stats.likesCount}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Me Gusta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="glass-card p-8 rounded-3xl shadow-2xl border-t border-white/50 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white italic uppercase">
                                Mis Reseñas
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Todas las reseñas que has publicado
                            </p>
                        </div>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map(review => (
                                <div
                                    key={review.id}
                                    onClick={() => navigate(`/car/${review.car.id}`)}
                                    className="cursor-pointer transition-transform hover:-translate-y-1"
                                >
                                    <ReviewCard review={review} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <Star className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Aún no has escrito ninguna reseña
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Comparte tu experiencia con la comunidad y ayuda a otros a tomar mejores decisiones.
                            </p>
                            <a
                                href="/search"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all transform hover:-translate-y-0.5"
                            >
                                Explorar Autos
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
