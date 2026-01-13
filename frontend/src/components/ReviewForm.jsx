import React, { useState, useRef } from 'react';
import { Star, AlertTriangle, Image as ImageIcon, X, HelpCircle, Upload, ChevronRight, ChevronDown, MessageSquare } from 'lucide-react';
import { uploadImage } from '../services/review.service';

const ReviewForm = ({ carId, onSubmit, onCancel, versions }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [failureTags, setFailureTags] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [specificVersion, setSpecificVersion] = useState('');
    const fileInputRef = useRef(null);

    // Hierarchical faults list
    const faultCategories = [
        {
            id: 'motor',
            name: 'Motor',
            subTags: [
                { id: 1, name: 'Sobrecalentamiento' },
                { id: 2, name: 'Fuga de Aceite' },
                { id: 3, name: 'Ruidos Extraños' },
                { id: 9, name: 'Pérdida de Potencia' }
            ]
        },
        {
            id: 'transmision',
            name: 'Transmisión',
            subTags: [
                { id: 4, name: 'Cambios Bruscos' },
                { id: 10, name: 'Deslizamiento' },
                { id: 11, name: 'Fuga de Líquido' }
            ]
        },
        {
            id: 'electrico',
            name: 'Eléctrico',
            subTags: [
                { id: 5, name: 'Batería' },
                { id: 12, name: 'Luces' },
                { id: 13, name: 'Sensores' },
                { id: 14, name: 'Multimedia/Pantalla' }
            ]
        },
        {
            id: 'suspension',
            name: 'Suspensión/Frenos',
            subTags: [
                { id: 6, name: 'Ruidos en Suspensión' },
                { id: 7, name: 'Desgaste Prematuro Frenos' },
                { id: 15, name: 'Vibraciones' }
            ]
        },
        {
            id: 'carroceria',
            name: 'Carrocería/Interior',
            subTags: [
                { id: 8, name: 'Pintura' },
                { id: 16, name: 'Ruidos Interiores' },
                { id: 17, name: 'Aire Acondicionado' }
            ]
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Por favor califica con estrellas');
            return;
        }

        setLoading(true);
        setError('');

        let type = 'NEUTRAL';
        if (rating >= 4) type = 'POSITIVE';
        if (rating <= 2) type = 'NEGATIVE';

        const payload = {
            car_id: carId,
            rating: rating,
            type: type,
            recommendation: comment,
            positiveComment: '',
            negativeComment: '',
            failureTags: failureTags,
            photos: photos,
            specificVersion: specificVersion
        };

        try {
            await onSubmit(payload);
            setRating(0);
            setComment('');
            setFailureTags([]);
            setPhotos([]);
        } catch (err) {
            setError(err.message || 'Error al enviar la reseña');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (photos.length + files.length > 5) {
            setError('Solo puedes subir un máximo de 5 fotos por reseña.');
            // Clear the input so they can try again with fewer files
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setUploading(true);
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);
            const newPhotos = results.map(res => res.url);
            setPhotos(prev => [...prev, ...newPhotos]);
        } catch (err) {
            console.error(err);
            setError('Error al subir imagen(es)');
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removePhoto = (url) => {
        setPhotos(photos.filter(p => p !== url));
    };

    const toggleTag = (tagId) => {
        if (failureTags.includes(tagId)) {
            setFailureTags(failureTags.filter(id => id !== tagId));
        } else {
            setFailureTags(prev => [...prev, tagId]);
        }
    };

    const toggleCategory = (catId) => {
        setExpandedCategories(prev => {
            const isExpanded = prev.includes(catId);
            if (isExpanded) {
                return prev.filter(id => id !== catId);
            } else {
                // Keep categories that have selected tags OR the one being opened
                // We need to find which tags belong to which category to check this efficiently, 
                // or just iterate categories.
                return [...prev, catId].filter(id => {
                    if (id === catId) return true;
                    // Find the category object
                    const category = faultCategories.find(c => c.id === id);
                    if (!category) return false;
                    // Check if any of its tags are selected
                    const hasSelectedTags = category.subTags.some(tag => failureTags.includes(tag.id));
                    return hasSelectedTags;
                });
            }
        });
    };

    return (
        <div className="glass-card p-6 rounded-3xl animate-fade-in border border-white/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary-500 fill-current" />
                        Tu Experiencia
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comparte tu opinión con la comunidad</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Rating Section */}
                <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        ¿Qué tal te pareció este auto?
                    </label>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    className={`h-10 w-10 transition-colors ${star <= (hoveredRating || rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="h-6 mt-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                        {hoveredRating === 1 && "Muy malo"}
                        {hoveredRating === 2 && "Malo"}
                        {hoveredRating === 3 && "Regular"}
                        {hoveredRating === 4 && "Bueno"}
                        {hoveredRating === 5 && "Excelente"}
                    </div>
                </div>



                {/* Optional Version Selection */}
                {
                    versions && versions.length > 0 && (
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Versión Específica (Opcional)
                            </label>
                            <select
                                value={specificVersion}
                                onChange={(e) => setSpecificVersion(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="">Selecciona una versión (General)</option>
                                {versions.map((v, idx) => (
                                    <option key={idx} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    )
                }

                {/* 2. Comment Section */}
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-primary-500" />
                        Cuéntanos más
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-0 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 min-h-[120px] resize-none shadow-inner"
                        placeholder="¿Qué es lo que más te gusta? ¿Qué problemas has tenido? ¿Lo recomendarías?"
                    />
                </div>

                {/* 3. Faults Section (Hierarchical) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Reportar Fallas (Opcional)
                    </label>
                    <div className="space-y-2">
                        {faultCategories.map(cat => (
                            <div key={cat.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => toggleCategory(cat.id)}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                                    {expandedCategories.includes(cat.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                                {expandedCategories.includes(cat.id) && (
                                    <div className="p-3 bg-white dark:bg-slate-900 flex flex-wrap gap-2 animate-fade-in">
                                        {cat.subTags.map(tag => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => toggleTag(tag.id)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${failureTags.includes(tag.id)
                                                    ? 'bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-500/50 dark:text-yellow-300'
                                                    : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-yellow-300'
                                                    }`}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Photos Section (File Upload) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                        Fotos del Auto (Max 5)
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            multiple
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading || photos.length >= 5}
                            className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${photos.length >= 5
                                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-slate-800/30'
                                : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:border-primary-500 hover:text-primary-500 bg-gray-50 dark:bg-slate-800/50'
                                }`}
                        >
                            {uploading ? (
                                <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <Upload className="h-6 w-6 mb-1" />
                                    <span className="text-xs">{photos.length >= 5 ? 'Máx 5' : 'Subir'}</span>
                                </>
                            )}
                        </button>

                        {photos.map((url, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden group shadow-md">
                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(url)}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="px-8 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/25 disabled:opacity-50 transform transition-all hover:-translate-y-0.5"
                    >
                        {loading ? 'Publicando...' : 'Publicar Reseña'}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default ReviewForm;
