import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Car, Users, MessageSquare, TrendingUp, Plus, Trash2, Edit, AlertTriangle, Check, X, ArrowLeft, Filter, Search, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getDashboardStats, getAllUsers, getReportedReviews, dismissReport, deleteReviewFromReport } from '../../services/admin.service';
import { getCars, deleteCar, updateCar } from '../../services/car.service';
import DeleteConfirmationModal from '../../components/admin/DeleteConfirmationModal';
import CarForm from '../../components/admin/CarForm';
import Toast from '../../components/admin/Toast';
import { carBrands } from '../../data/carData';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState(location.state?.view || 'overview'); // overview, cars, users, reports
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCars: 0,
        totalUsers: 0,
        totalReviews: 0,
        totalReports: 0
    });

    // Data lists
    const [carsList, setCarsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [reportsList, setReportsList] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        year: ''
    });

    // Modals state
    const [deletingCarId, setDeletingCarId] = useState(null);
    const [editingCar, setEditingCar] = useState(null);
    const [deletingReportId, setDeletingReportId] = useState(null);

    // Toast notification state
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        if (view === 'cars') loadCars();
        if (view === 'users') loadUsers();
        if (view === 'reports') loadReports();
    }, [view]);

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCars = async () => {
        setLoading(true);
        try {
            const data = await getCars();
            setCarsList(data);
        } catch (error) {
            console.error("Error loading cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsersList(data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await getReportedReviews();
            setReportsList(data);
        } catch (error) {
            console.error("Error loading reports:", error);
        } finally {
            setLoading(false);
        }
    };

    // Delete Logic
    const handleDeleteClick = (id) => {
        setDeletingCarId(id);
    };

    const confirmDelete = async () => {
        if (!deletingCarId) return;

        try {
            await deleteCar(deletingCarId);
            loadCars(); // Reload list
            loadStats(); // Reload stats
            setDeletingCarId(null);
            setToast({ message: 'Auto eliminado exitosamente', type: 'success' });
        } catch (error) {
            console.error("Error deleting car:", error);
            setToast({ message: 'Error al eliminar el auto', type: 'error' });
        }
    };

    // Edit Logic
    const handleEditClick = (car) => {
        setEditingCar(car);
    };

    const handleUpdateCar = async (updatedData) => {
        try {
            await updateCar(editingCar.id, updatedData);
            setEditingCar(null);
            loadCars();
            setToast({ message: 'Auto actualizado exitosamente', type: 'success' });
        } catch (error) {
            console.error("Error updating car:", error);
            setToast({ message: 'Error al actualizar el auto', type: 'error' });
        }
    };

    // Report Actions
    const handleDismissReport = async (reportId) => {
        try {
            await dismissReport(reportId);
            loadReports(); // Reload reports list
            setToast({ message: 'Reporte descartado exitosamente', type: 'success' });
        } catch (error) {
            console.error("Error dismissing report:", error);
            setToast({ message: 'Error al descartar el reporte', type: 'error' });
        }
    };

    const handleDeleteReview = async (reportId) => {
        setDeletingReportId(reportId);
    };

    const confirmDeleteReview = async () => {
        if (!deletingReportId) return;

        try {
            await deleteReviewFromReport(deletingReportId);
            loadReports(); // Reload reports list
            loadStats(); // Reload stats
            setDeletingReportId(null);
            setToast({ message: 'Reseña eliminada exitosamente', type: 'success' });
        } catch (error) {
            console.error("Error deleting review:", error);
            setToast({ message: 'Error al eliminar la reseña', type: 'error' });
        }
    };

    // Filter Logic
    const filteredCars = carsList.filter(car => {
        const matchMake = filters.make ? car.make === filters.make : true;
        const matchModel = filters.model ? car.model.toLowerCase().includes(filters.model.toLowerCase()) : true;
        const matchYear = filters.year ? car.year.toString() === filters.year : true;
        return matchMake && matchModel && matchYear;
    });

    const statCards = [
        {
            id: 'cars',
            label: 'Total Autos',
            value: stats.totalCars,
            icon: Car,
            color: 'primary',
            action: null
        },
        {
            id: 'users',
            label: 'Usuarios',
            value: stats.totalUsers,
            icon: Users,
            color: 'secondary',
            action: null
        },
        {
            id: 'reports',
            label: 'Reportes',
            value: stats.totalReports,
            icon: AlertTriangle,
            color: 'red',
            action: null
        },
        {
            id: 'reviews',
            label: 'Total Reseñas',
            value: stats.totalReviews,
            icon: MessageSquare,
            color: 'green',
            action: null
        },
    ];

    const renderOverview = () => (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            onClick={stat.action}
                            className={`glass-card p-6 rounded-3xl border-t border-white/50 dark:border-white/10 transition-all duration-300 ${stat.action ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                                <div className={`h-14 w-14 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                                    <Icon className={`h-7 w-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-8 rounded-3xl border-t border-white/50 dark:border-white/10 mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 italic uppercase">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setView('cars')}
                        className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-500 hover:to-secondary-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-secondary-600/30"
                    >
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Car className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Gestionar Autos</h3>
                            <p className="text-sm text-white/80">Ver y editar el inventario</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setView('reports')}
                        className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-red-600/30"
                    >
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Gestionar Reportes</h3>
                            <p className="text-sm text-white/80">Moderar reseñas reportadas</p>
                        </div>
                    </button>

                    <Link
                        to="/admin/create-car"
                        className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-primary-600/30"
                    >
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Crear Nuevo Auto</h3>
                            <p className="text-sm text-white/80">Agregar un auto a la plataforma</p>
                        </div>
                    </Link>

                    <button
                        onClick={() => setView('users')}
                        className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-500 hover:to-secondary-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-secondary-600/30"
                    >
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Ver Usuarios</h3>
                            <p className="text-sm text-white/80">Lista de usuarios registrados</p>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );

    const renderCarsList = () => (
        <div className="glass-card p-8 rounded-3xl border-t border-white/50 dark:border-white/10">
            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <select
                        value={filters.make}
                        onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                    >
                        <option value="">Todas las Marcas</option>
                        {carBrands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filtrar por Modelo..."
                        value={filters.model}
                        onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative">
                    <input
                        type="number"
                        placeholder="Año"
                        value={filters.year}
                        onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => setFilters({ make: '', model: '', year: '' })}
                    className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Limpiar Filtros
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Auto</th>
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Año</th>
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Motor</th>
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Creado Por</th>
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCars.map((car) => (
                            <tr key={car.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={car.mainImageUrl}
                                            alt={car.model}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{car.make} {car.model}</p>
                                            <p className="text-sm text-gray-500">{car.version}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-gray-700 dark:text-gray-300">{car.year}</td>
                                <td className="py-4 text-gray-700 dark:text-gray-300">
                                    {car.specs?.engine || '-'}
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                                            {(car.createdBy?.username || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm truncate max-w-[100px]" title={car.createdBy?.username || 'Desconocido'}>
                                            {car.createdBy?.username || 'Desconocido'}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEditClick(car)}
                                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(car.id)}
                                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCars.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No se encontraron autos con los filtros seleccionados</div>
                )}
            </div>
        </div>
    );

    const renderUsersList = () => (
        <div className="glass-card p-8 rounded-3xl border-t border-white/50 dark:border-white/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Usuario</th>
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Email</th>
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Rol</th>
                            <th className="pb-4 font-bold text-gray-600 dark:text-gray-400">Fecha Registro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {usersList.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                    </div>
                                </td>
                                <td className="py-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {user.role || 'user'}
                                    </span>
                                </td>
                                <td className="py-4 text-gray-500 text-sm">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usersList.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No hay usuarios registrados</div>
                )}
            </div>
        </div>
    );

    const renderReportsList = () => {
        const getReviewContent = (review) => {
            if (review.positiveComment) return review.positiveComment;
            if (review.negativeComment) return review.negativeComment;
            if (review.recommendation) return review.recommendation;
            return "Sin comentario";
        };

        return (
            <div className="glass-card p-8 rounded-3xl border-t border-white/50 dark:border-white/10">
                <div className="space-y-6">
                    {reportsList.map((report) => (
                        <div key={report.id} className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">
                                        Reporte: {report.reason}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Reportado por: {report.user?.username || 'Usuario desconocido'}
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-bold">
                                    {report.status}
                                </span>
                            </div>

                            {/* Review Content */}
                            <div className="bg-white dark:bg-black/20 p-4 rounded-xl mb-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reseña Reportada:</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Por: {report.review?.user?.username || 'Usuario'} •
                                            Auto: {report.review?.car?.make} {report.review?.car?.model} {report.review?.car?.year}
                                        </p>
                                    </div>
                                    {report.review?.car && (
                                        <button
                                            onClick={() => navigate(`/car/${report.review.car.id}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Ver Reseña
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-900 dark:text-white italic line-clamp-3">
                                    "{getReviewContent(report.review)}"
                                </p>

                                {/* Failure Tags */}
                                {report.review?.failureTags && report.review.failureTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {report.review.failureTags.map(tag => (
                                            <span key={tag.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Photos */}
                                {report.review?.photos && report.review.photos.length > 0 && (
                                    <div className="flex gap-2 mt-3">
                                        {report.review.photos.slice(0, 3).map(photo => (
                                            <img
                                                key={photo.id}
                                                src={photo.url}
                                                alt="Review"
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        ))}
                                        {report.review.photos.length > 3 && (
                                            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                                                +{report.review.photos.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {report.details && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                    <strong>Detalles del reporte:</strong> {report.details}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDeleteReview(report.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar Reseña
                                </button>
                                <button
                                    onClick={() => handleDismissReport(report.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                                >
                                    <X className="h-4 w-4" />
                                    Descartar Reporte
                                </button>
                            </div>
                        </div>
                    ))}
                    {reportsList.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Check className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
                            <p>¡Excelente! No hay reportes pendientes.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AdminLayout onNavigate={setView} currentView={view}>
            <div>
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    {view !== 'overview' && (
                        <button
                            onClick={() => setView('overview')}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic uppercase">
                            {view === 'overview' ? 'Dashboard' :
                                view === 'cars' ? 'Gestión de Autos' :
                                    view === 'users' ? 'Usuarios Registrados' :
                                        'Reportes de Reseñas'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {view === 'overview' ? 'Bienvenido al panel de administración' :
                                view === 'cars' ? 'Administra el inventario de vehículos' :
                                    view === 'users' ? 'Lista de todos los usuarios de la plataforma' :
                                        'Revisa y modera las reseñas reportadas'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        {view === 'overview' && renderOverview()}
                        {view === 'cars' && renderCarsList()}
                        {view === 'users' && renderUsersList()}
                        {view === 'reports' && renderReportsList()}
                    </>
                )}

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={!!deletingCarId}
                    onClose={() => setDeletingCarId(null)}
                    onConfirm={confirmDelete}
                    title="Eliminar Auto"
                    message="¿Estás seguro de que deseas eliminar este auto? Esta acción no se puede deshacer y se eliminarán todas las reseñas y fotos asociadas."
                />

                {/* Delete Review from Report Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={!!deletingReportId}
                    onClose={() => setDeletingReportId(null)}
                    onConfirm={confirmDeleteReview}
                    title="Eliminar Reseña Reportada"
                    message="¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer y la reseña será eliminada permanentemente junto con el reporte."
                />

                {/* Edit Car Modal */}
                {editingCar && ReactDOM.createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white dark:bg-[#121212] rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="p-8 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white italic uppercase">
                                    Editar Auto
                                </h2>
                                <button
                                    onClick={() => setEditingCar(null)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-0">
                                <CarForm
                                    initialData={editingCar}
                                    onSubmit={handleUpdateCar}
                                    submitLabel="Guardar Cambios"
                                />
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
