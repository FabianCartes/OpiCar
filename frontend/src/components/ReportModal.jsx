import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, AlertTriangle, Send } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, onSubmit, loading }) => {
    const [reason, setReason] = useState('Spam');
    const [details, setDetails] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(reason, details);
    };

    const reasons = [
        'Spam',
        'Contenido Ofensivo',
        'Información Falsa',
        'Acoso',
        'Otro'
    ];

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800 transform transition-all scale-100">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Reportar Reseña
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Razón del reporte
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-800 border-0 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                        >
                            {reasons.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Detalles adicionales
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-800 border-0 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 min-h-[100px] resize-none"
                            placeholder="Describe brevemente el problema..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 disabled:opacity-50 flex items-center gap-2 transition-all"
                        >
                            {loading ? (
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Enviar Reporte
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ReportModal;
