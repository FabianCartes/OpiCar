import React from 'react';

const LoadingScreen = ({ message = 'Cargando...' }) => {
    return (
        <div className="min-h-screen pt-20 pb-12 relative overflow-hidden flex items-center justify-center">
            {/* Dynamic Background - Same as other pages */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gray-50 dark:bg-dark-bg transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-secondary-500)_0%,_transparent_40%)] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Loading Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Animated Logo/Spinner */}
                <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="h-20 w-20 rounded-full border-4 border-primary-200 dark:border-primary-900/30 border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 animate-pulse shadow-lg shadow-primary-600/30"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <p className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight animate-pulse">
                        {message}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Esto solo tomará un momento
                    </p>
                </div>

                {/* Animated dots */}
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
