import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-900/50',
            iconColor: 'text-green-600 dark:text-green-400',
            textColor: 'text-green-900 dark:text-green-100'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-900/50',
            iconColor: 'text-red-600 dark:text-red-400',
            textColor: 'text-red-900 dark:text-red-100'
        }
    };

    const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type];

    return (
        <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
            <div className={`${bgColor} ${borderColor} border rounded-2xl p-4 shadow-2xl backdrop-blur-sm min-w-[320px] max-w-md`}>
                <div className="flex items-start gap-3">
                    <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0 mt-0.5`} />
                    <p className={`flex-1 font-medium ${textColor}`}>{message}</p>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
