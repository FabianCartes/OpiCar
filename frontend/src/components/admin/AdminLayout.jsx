import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Users, Settings, ChevronRight } from 'lucide-react';

const AdminLayout = ({ children, onNavigate, currentView }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true, view: 'overview' },
        { path: '/admin/create-car', icon: Car, label: 'Crear Auto', isRoute: true },
        { path: '/admin', icon: Users, label: 'Usuarios', view: 'users' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-bg">
            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden md:flex md:flex-col w-64 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-[#0a0a0a]">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <Settings className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-white italic uppercase">Panel Admin</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Gestión de Plataforma</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = item.view
                                    ? currentView === item.view
                                    : isActive(item.path, item.exact);

                                if (item.isRoute) {
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                            {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                                        </Link>
                                    );
                                }

                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => onNavigate && onNavigate(item.view)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{item.label}</span>
                                        {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
