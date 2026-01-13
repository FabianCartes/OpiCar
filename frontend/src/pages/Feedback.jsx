import React, { useState, useEffect } from 'react';
import { createFeedback, getFeedbacks } from '../services/feedback.service';
import { MessageSquare, Bug, Lightbulb, Send, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Feedback = () => {
    const [type, setType] = useState('SUGGESTION');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const data = await getFeedbacks();
            // Filter only suggestions to show publicly, or show all if desired. 
            // Usually bug reports might be private, but user asked for "suggestions section".
            // Let's show both but visually distinct, or just suggestions.
            // For now, showing all as "Community Feedback"
            setFeedbacks(data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createFeedback({ type, subject, message });
            setSubject('');
            setMessage('');
            fetchFeedbacks(); // Refresh list
            alert('¡Gracias por tu feedback!');
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert('Hubo un error al enviar tu feedback.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 italic uppercase">
                        Tu Opinión Importa
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Ayúdanos a mejorar AutoReal. Envíanos tus sugerencias o reporta errores para que podamos construir la mejor plataforma juntos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                <Send className="h-6 w-6 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enviar Feedback</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Feedback</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setType('SUGGESTION')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${type === 'SUGGESTION'
                                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-400'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Lightbulb className="h-5 w-5" />
                                        <span className="font-medium">Sugerencia</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('BUG_REPORT')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${type === 'BUG_REPORT'
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Bug className="h-5 w-5" />
                                        <span className="font-medium">Error</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asunto</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border transition-colors"
                                    placeholder="Resumen breve de tu idea o problema"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensaje</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={5}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border transition-colors"
                                    placeholder="Cuéntanos más detalles..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Enviar Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Community Suggestions List */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                                <MessageSquare className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sugerencias de la Comunidad</h2>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                </div>
                            ) : feedbacks.length === 0 ? (
                                <div className="text-center py-12 bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">Aún no hay sugerencias. ¡Sé el primero!</p>
                                </div>
                            ) : (
                                feedbacks.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.type === 'SUGGESTION'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                    }`}>
                                                    {item.type === 'SUGGESTION' ? 'Sugerencia' : 'Error'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: es })}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.subject}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                            {item.message}
                                        </p>

                                        {item.user && (
                                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                                                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    {item.user.username || 'Usuario'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
