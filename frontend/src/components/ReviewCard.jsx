import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, User, AlertTriangle, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toggleReaction, reportReview, deleteReview } from '../services/review.service';
import { useAuth } from '../context/AuthContext';

import ReportModal from './ReportModal';
import ConfirmModal from './ConfirmModal';
import ReviewDetailsModal from './ReviewDetailsModal';
import Toast from './Toast';

const ReviewCard = ({ review, onDelete }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(review.likes || 0);
    const [dislikes, setDislikes] = useState(review.dislikes || 0);
    const [userReaction, setUserReaction] = useState(review.userReaction); // 'LIKE', 'DISLIKE', null
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    const isPositive = review.type === 'POSITIVE';
    const canDelete = user && (user.id === review.user?.id || user.role === 'admin');

    const handleReaction = async (e, type) => {
        e.stopPropagation();
        try {
            // Optimistic update
            if (userReaction === type) {
                // Toggle off
                setUserReaction(null);
                if (type === 'LIKE') setLikes(prev => prev - 1);
                else setDislikes(prev => prev - 1);
            } else {
                // Switch or new
                if (userReaction === 'LIKE') setLikes(prev => prev - 1);
                if (userReaction === 'DISLIKE') setDislikes(prev => prev - 1);

                setUserReaction(type);
                if (type === 'LIKE') setLikes(prev => prev + 1);
                else setDislikes(prev => prev + 1);
            }

            await toggleReaction(review.id, type);
        } catch (error) {
            console.error('Error reacting:', error);
            // Revert logic could go here
        }
    };

    const handleReportSubmit = async (reason, details) => {
        setReporting(true);
        try {
            await reportReview(review.id, reason, details);
            setToast({
                message: 'Reseña reportada correctamente. Gracias por ayudarnos a mantener la comunidad segura.',
                type: 'success'
            });
            setShowReportModal(false);
        } catch (error) {
            console.error('Error reporting:', error);
            setToast({
                message: 'Error al enviar el reporte',
                type: 'error'
            });
        } finally {
            setReporting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteReview(review.id);
            if (onDelete) onDelete(review.id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting review:', error);
            setToast({
                message: 'Error al eliminar la reseña',
                type: 'error'
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setShowDetailsModal(true)}
                className="glass-card p-6 rounded-2xl transition-all hover:bg-white/80 dark:hover:bg-slate-800/80 group relative cursor-pointer hover:shadow-xl hover:-translate-y-1 h-full flex flex-col"
            >
                <div className="flex justify-between items-start mb-4">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/user/${review.user?.id}`;
                        }}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{review.user?.username || 'Usuario'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(review.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isPositive
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                        : review.type === 'NEGATIVE'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                            : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                        {review.type === 'POSITIVE' ? 'Positiva' : review.type === 'NEGATIVE' ? 'Negativa' : 'Neutral'}
                    </div>
                </div>

                <div className="space-y-4 mb-6 flex-1">
                    {review.positiveComment && (
                        <div className="p-3 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> Pros
                            </p>
                            <p className={`text-sm text-gray-700 dark:text-gray-300 ${review.photos && review.photos.length > 0 ? 'line-clamp-4' : 'line-clamp-6'}`}>{review.positiveComment}</p>
                        </div>
                    )}

                    {review.negativeComment && (
                        <div className="p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                            <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1 flex items-center gap-1">
                                <ThumbsDown className="h-3 w-3" /> Contras
                            </p>
                            <p className={`text-sm text-gray-700 dark:text-gray-300 ${review.photos && review.photos.length > 0 ? 'line-clamp-4' : 'line-clamp-6'}`}>{review.negativeComment}</p>
                        </div>
                    )}

                    {review.recommendation && (
                        <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white italic line-clamp-2">
                                "{review.recommendation}"
                            </p>
                        </div>
                    )}

                    {/* Failure Tags */}
                    {review.failureTags && review.failureTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {review.failureTags.slice(0, 3).map(tag => (
                                <span key={tag.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {tag.name}
                                </span>
                            ))}
                            {review.failureTags.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    +{review.failureTags.length - 3} más
                                </span>
                            )}
                        </div>
                    )}

                    {/* Photos */}
                    {review.photos && review.photos.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 mt-3">
                            {review.photos.slice(0, 4).map(photo => (
                                <div key={photo.id} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img src={photo.url} alt="Review attachment" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {review.photos.length > 4 && (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-bold">
                                    +{review.photos.length - 4}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                    <div className="flex space-x-4">
                        <button
                            onClick={(e) => handleReaction(e, 'LIKE')}
                            className={`flex items-center space-x-1 transition-colors text-sm group ${userReaction === 'LIKE' ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'}`}
                        >
                            <ThumbsUp className={`h-4 w-4 group-hover:scale-110 transition-transform ${userReaction === 'LIKE' ? 'fill-current' : ''}`} />
                            <span>{likes}</span>
                        </button>
                        <button
                            onClick={(e) => handleReaction(e, 'DISLIKE')}
                            className={`flex items-center space-x-1 transition-colors text-sm group ${userReaction === 'DISLIKE' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'}`}
                        >
                            <ThumbsDown className={`h-4 w-4 group-hover:scale-110 transition-transform ${userReaction === 'DISLIKE' ? 'fill-current' : ''}`} />
                            <span>{dislikes}</span>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {canDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                                className="text-gray-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1"
                            >
                                <Trash2 className="h-3 w-3" /> Eliminar
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowReportModal(true); }}
                            className="text-gray-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1"
                        >
                            <Flag className="h-3 w-3" /> Reportar
                        </button>
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReportSubmit}
                loading={reporting}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Eliminar Reseña"
                message="¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                loading={deleting}
            />

            <ReviewDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                review={review}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default ReviewCard;
