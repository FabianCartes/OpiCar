import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronLeft, ChevronRight, User, ThumbsUp, ThumbsDown, AlertTriangle, Star, Calendar } from 'lucide-react';
import FullScreenImageModal from './FullScreenImageModal';

const ReviewDetailsModal = ({ isOpen, onClose, review }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    if (!isOpen || !review) return null;

    const hasPhotos = review.photos && review.photos.length > 0;

    const nextPhoto = (e) => {
        e?.stopPropagation();
        if (hasPhotos) {
            setCurrentPhotoIndex((prev) => (prev + 1) % review.photos.length);
        }
    };

    const prevPhoto = (e) => {
        e?.stopPropagation();
        if (hasPhotos) {
            setCurrentPhotoIndex((prev) => (prev - 1 + review.photos.length) % review.photos.length);
        }
    };

    const toggleFullScreen = (e) => {
        e?.stopPropagation();
        setIsFullScreen(true);
    };

    const isPositive = review.type === 'POSITIVE';

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
                {/* Gradient backdrop that fades to transparent at edges */}
                <div
                    className="absolute inset-0 backdrop-blur-md"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.1) 70%, transparent 100%)'
                    }}
                ></div>
                <div
                    className="absolute inset-0 dark:block hidden"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.3) 70%, transparent 100%)'
                    }}
                ></div>

                <div
                    className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative z-10"
                    style={{
                        boxShadow: '0 0 100px 40px rgba(0, 0, 0, 0.3), 0 0 200px 80px rgba(0, 0, 0, 0.2)'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Photo Section */}
                    {hasPhotos ? (
                        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-black relative flex items-center justify-center min-h-[300px] md:min-h-full group">
                            <img
                                src={review.photos[currentPhotoIndex].url}
                                alt={`Review photo ${currentPhotoIndex + 1}`}
                                className="max-w-full max-h-full object-contain cursor-zoom-in"
                                onClick={toggleFullScreen}
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                    Clic para ampliar
                                </div>
                            </div>

                            {review.photos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevPhoto}
                                        className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextPhoto}
                                        className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        {review.photos.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-2 w-2 rounded-full transition-all ${idx === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 items-center justify-center p-8">
                            <div className="text-center">
                                <div className="h-20 w-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <User className="h-10 w-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Sin fotos adjuntas</p>
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className={`w-full ${hasPhotos ? 'md:w-1/2' : 'md:w-2/3'} flex flex-col max-h-[90vh]`}>
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{review.user?.username || 'Usuario'}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        {review.specificVersion && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                Versión: {review.specificVersion}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${isPositive
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                : review.type === 'NEGATIVE'
                                    ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                {review.type === 'POSITIVE' ? (
                                    <><ThumbsUp className="h-4 w-4 mr-2" /> Experiencia Positiva</>
                                ) : review.type === 'NEGATIVE' ? (
                                    <><ThumbsDown className="h-4 w-4 mr-2" /> Experiencia Negativa</>
                                ) : (
                                    <><Star className="h-4 w-4 mr-2" /> Experiencia Neutral</>
                                )}
                            </div>

                            {review.positiveComment && (
                                <div>
                                    <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                        <ThumbsUp className="h-4 w-4" /> Lo bueno
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
                                        {review.positiveComment}
                                    </p>
                                </div>
                            )}

                            {review.negativeComment && (
                                <div>
                                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                        <ThumbsDown className="h-4 w-4" /> Lo malo
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                                        {review.negativeComment}
                                    </p>
                                </div>
                            )}

                            {review.recommendation && (
                                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border-l-4 border-primary-500">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Recomendación</h4>
                                    <p className="text-gray-600 dark:text-gray-300 italic">"{review.recommendation}"</p>
                                </div>
                            )}

                            {review.failureTags && review.failureTags.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" /> Fallas reportadas
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {review.failureTags.map(tag => (
                                            <span key={tag.id} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900/50">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <FullScreenImageModal
                isOpen={isFullScreen}
                onClose={() => setIsFullScreen(false)}
                images={review.photos}
                initialIndex={currentPhotoIndex}
            />
        </>,
        document.body
    );
};

export default ReviewDetailsModal;
