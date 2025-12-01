import React, { useState } from 'react';
import { Search } from 'lucide-react';
import AutocompleteInput from './admin/AutocompleteInput';
import { carBrands, carModels } from '../data/carData';

const SearchBar = ({ onSearch }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (make) params.make = make;
        if (model) params.model = model;
        if (year) params.year = year;
        onSearch(params);
    };

    // Get models for selected make
    const getModelsForMake = () => {
        if (!make) return [];
        return carModels[make] || [];
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-2xl">
            <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wider">Marca</label>
                <AutocompleteInput
                    value={make}
                    onChange={(value) => {
                        setMake(value);
                        // Clear model if make changes
                        if (value !== make) {
                            setModel('');
                        }
                    }}
                    options={carBrands}
                    placeholder="ej. Toyota"
                />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wider">Modelo</label>
                <AutocompleteInput
                    value={model}
                    onChange={setModel}
                    options={getModelsForMake()}
                    placeholder={make ? "ej. Corolla" : "Selecciona una marca primero"}
                    disabled={!make}
                />
            </div>
            <div className="w-full md:w-32">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wider">Año</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white placeholder-gray-400"
                    placeholder="2020"
                />
            </div>
            <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white p-3 rounded-xl transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center"
            >
                <Search className="h-6 w-6" />
            </button>
        </form>
    );
};

export default SearchBar;
