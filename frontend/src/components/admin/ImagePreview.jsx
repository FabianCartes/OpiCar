import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ImagePreview = ({ url }) => {
    const [imageStatus, setImageStatus] = useState('loading'); // loading, success, error

    return (
        <div className="relative">
            {imageStatus === 'loading' && (
                <div className="w-full h-64 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500">Cargando imagen...</p>
                    </div>
                </div>
            )}

            {imageStatus === 'error' && (
                <div className="w-full h-64 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 flex items-center justify-center">
                    <div className="text-center p-6">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                        <p className="text-red-700 dark:text-red-400 font-bold mb-2">
                            ⚠️ No se pudo cargar la imagen
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                            Esta URL tiene restricciones o no es válida
                        </p>
                        <div className="text-xs text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded">
                            <p className="font-mono break-all">{url}</p>
                        </div>
                    </div>
                </div>
            )}

            <img
                src={url}
                alt="Preview"
                className={`w-full h-64 object-cover rounded-xl border-2 border-green-200 dark:border-green-900/50 ${imageStatus === 'success' ? 'block' : 'hidden'
                    }`}
                onLoad={() => setImageStatus('success')}
                onError={() => setImageStatus('error')}
            />

            {imageStatus === 'success' && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <CheckCircle className="h-3 w-3" />
                    Imagen válida
                </div>
            )}
        </div>
    );
};

export default ImagePreview;
