import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Calendar, ArrowLeft } from 'lucide-react';
import { getPublicUserProfile, getPublicUserStats } from '../services/user.service';
import LoadingScreen from '../components/LoadingScreen';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [stats, setStats] = useState({
        reviewsCount: 0,
        favoritesCount: 0,
        likesCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const [userData, statsData] = await Promise.all([
                    getPublicUserProfile(id),
                    getPublicUserStats(id)
                ]);
                setProfileUser(userData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching public profile:', error);
                setError('No se pudo cargar el perfil del usuario');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPublicProfile();
        }
    }, [id]);

    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : 'U';
    };

    if (loading) {
        return <LoadingScreen message="Cargando perfil" />;
    }

    if (error || !profileUser) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 dark:text-gray-400">{error || 'Usuario no encontrado'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                    Volver
                </button>
            </div>
        );
    }

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
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Volver</span>
                </button>

                {/* User Info Card */}
                <div className="glass-card p-8 rounded-3xl shadow-2xl border-t border-white/50 dark:border-white/10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary-600/30">
                                {getInitials(profileUser.username)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-green-500 rounded-full border-4 border-white dark:border-dark-bg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic uppercase tracking-tight">
                                {profileUser.username}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 justify-center md:justify-start">
                                    <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    <span className="font-medium">{profileUser.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 justify-center md:justify-start">
                                    <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    <span className="font-medium">Miembro desde {new Date(profileUser.created_at || Date.now()).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
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
            </div>
        </div>
    );
};

export default PublicProfile;
