import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800 py-8 mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} OpiCar. Todos los derechos reservados.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <Link to="/feedback" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                            Sugerencias
                        </Link>
                        <a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                            Política de Privacidad
                        </a>
                        <a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                            Términos de Servicio
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
