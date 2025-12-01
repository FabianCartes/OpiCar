import React, { useState, useEffect } from 'react';
import { Car, Image, FileText, Settings, Check, ArrowRight, ArrowLeft, Zap, Battery, Upload, X } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import ImagePreview from './ImagePreview';
import { carBrands, carModels, transmissionTypes, engineTypes, fuelTypes, electricMotorTypes } from '../../data/carData';
import { uploadImage } from '../../services/review.service';

const CarForm = ({ initialData, onSubmit, loading, submitLabel = "Publicar Auto" }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [availableModels, setAvailableModels] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await uploadImage(file);
            setFormData(prev => ({
                ...prev,
                mainImageUrl: response.url
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const defaultData = {
        make: '',
        model: '',
        year: '',
        version: '',
        description: '',
        specs: {
            engine: '',
            horsepower: '',
            transmission: '',
            transmissionType: '',
            fuelEconomy: '',
            drivetrain: '',
            fuelType: '',
            isElectric: false,
            batteryRange: '',
            acceleration0to100: ''
        },
        mainImageUrl: '',
        photos: []
    };

    const [formData, setFormData] = useState(initialData || defaultData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        if (formData.make && carModels[formData.make]) {
            setAvailableModels(carModels[formData.make]);
        } else {
            setAvailableModels([]);
        }
    }, [formData.make]);

    const steps = [
        { title: 'Información Básica', icon: Car },
        { title: 'Especificaciones', icon: Settings },
        { title: 'Fotos', icon: Image },
        { title: 'Revisión', icon: FileText }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSpecChange = (e) => {
        const { name, value, type, checked } = e.target;

        // If toggling electric mode, auto-set fuel type
        if (name === 'isElectric') {
            setFormData(prev => ({
                ...prev,
                specs: {
                    ...prev.specs,
                    isElectric: checked,
                    fuelType: checked ? 'Eléctrico' : prev.specs.fuelType
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                specs: {
                    ...prev.specs,
                    [name]: type === 'checkbox' ? checked : value
                }
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        // Ensure year is integer
        const submissionData = {
            ...formData,
            year: parseInt(formData.year)
        };
        onSubmit(submissionData);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <AutocompleteInput
                                    label="Marca"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleInputChange}
                                    options={carBrands}
                                    placeholder="Ej: Toyota"
                                    required
                                />
                            </div>
                            <div>
                                <AutocompleteInput
                                    label="Modelo"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    options={availableModels}
                                    placeholder={availableModels.length > 0 ? "Selecciona un modelo..." : "Escribe el modelo..."}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Año *
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Ej: 2024"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Versión *
                                </label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Ej: SE, Limited, GT"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descripción *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Descripción detallada del auto..."
                            />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        {/* Electric Car Toggle */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <div className={`p-3 rounded-full ${formData.specs.isElectric ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                <Zap className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Vehículo Eléctrico</h4>
                                <p className="text-sm text-gray-500">Marca esta opción si el auto es 100% eléctrico</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isElectric"
                                    checked={formData.specs.isElectric}
                                    onChange={handleSpecChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <AutocompleteInput
                                    label="Motor / Propulsión"
                                    name="engine"
                                    value={formData.specs.engine}
                                    onChange={handleSpecChange}
                                    options={formData.specs.isElectric ? electricMotorTypes : engineTypes}
                                    placeholder={formData.specs.isElectric ? "Selecciona tipo de motor eléctrico" : "Ej: 2.0L 4-Cilindros Turbo"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {formData.specs.isElectric ? 'Potencia' : 'Caballos de Fuerza'}
                                </label>
                                <input
                                    type="text"
                                    name="horsepower"
                                    value={formData.specs.horsepower}
                                    onChange={handleSpecChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder={formData.specs.isElectric ? "Ej: 283 kW (380 hp)" : "Ej: 169 hp"}
                                />
                            </div>

                            {/* Transmission Section */}
                            <div>
                                <AutocompleteInput
                                    label="Tipo de Transmisión"
                                    name="transmissionType"
                                    value={formData.specs.transmissionType}
                                    onChange={handleSpecChange}
                                    options={transmissionTypes}
                                    placeholder="Ej: Automática"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Detalle Transmisión (Opcional)
                                </label>
                                <input
                                    type="text"
                                    name="transmission"
                                    value={formData.specs.transmission}
                                    onChange={handleSpecChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Ej: CVT Direct Shift de 10 vel."
                                />
                            </div>

                            {/* Fuel/Battery Section */}
                            {formData.specs.isElectric ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Autonomía (km)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="batteryRange"
                                            value={formData.specs.batteryRange}
                                            onChange={handleSpecChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10"
                                            placeholder="Ej: 450 km"
                                        />
                                        <Battery className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tipo de Combustible
                                    </label>
                                    <input
                                        type="text"
                                        name="fuelType"
                                        value={formData.specs.fuelType}
                                        onChange={handleSpecChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Ej: Gasolina"
                                        list="fuelTypeOptions"
                                    />
                                    <datalist id="fuelTypeOptions">
                                        {fuelTypes.map(type => (
                                            <option key={type} value={type} />
                                        ))}
                                    </datalist>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Consumo / Eficiencia
                                </label>
                                <input
                                    type="text"
                                    name="fuelEconomy"
                                    value={formData.specs.fuelEconomy}
                                    onChange={handleSpecChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder={formData.specs.isElectric ? "Ej: 18 kWh/100km" : "Ej: 15 km/l mixto"}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tracción
                                </label>
                                <select
                                    name="drivetrain"
                                    value={formData.specs.drivetrain}
                                    onChange={handleSpecChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="FWD">FWD (Delantera)</option>
                                    <option value="RWD">RWD (Trasera)</option>
                                    <option value="AWD">AWD (Todas las ruedas)</option>
                                    <option value="4WD">4WD (4x4)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Aceleración 0-100 km/h (Opcional)
                                </label>
                                <input
                                    type="text"
                                    name="acceleration0to100"
                                    value={formData.specs.acceleration0to100}
                                    onChange={handleSpecChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Ej: 5.8 segundos"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Foto Principal del Auto *
                            </label>

                            <div className="flex flex-col gap-4">
                                {/* Upload Area */}
                                {!formData.mainImageUrl ? (
                                    <div className="w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploading ? (
                                                    <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mb-3" />
                                                ) : (
                                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                                )}
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">{uploading ? 'Subiendo...' : 'Haz clic para subir'}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SVG, PNG, JPG or GIF
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-64 rounded-xl overflow-hidden group shadow-lg">
                                        <img
                                            src={formData.mainImageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, mainImageUrl: '' }))}
                                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Link Chileautos (Opcional)
                                </label>
                                <input
                                    type="url"
                                    name="chileautosUrl"
                                    value={formData.chileautosUrl || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://www.chileautos.cl/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Link Marketplace (Opcional)
                                </label>
                                <input
                                    type="url"
                                    name="marketplaceUrl"
                                    value={formData.marketplaceUrl || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://www.facebook.com/marketplace/..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4">
                                Revisa la información antes de publicar
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-700 dark:text-green-300 font-medium">Marca:</span>
                                    <span className="text-green-900 dark:text-green-100">{formData.make}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700 dark:text-green-300 font-medium">Modelo:</span>
                                    <span className="text-green-900 dark:text-green-100">{formData.model}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700 dark:text-green-300 font-medium">Año:</span>
                                    <span className="text-green-900 dark:text-green-100">{formData.year}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700 dark:text-green-300 font-medium">Versión:</span>
                                    <span className="text-green-900 dark:text-green-100">{formData.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700 dark:text-green-300 font-medium">Motor:</span>
                                    <span className="text-green-900 dark:text-green-100">{formData.specs.engine}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700 dark:text-green-300 font-medium">Transmisión:</span>
                                    <span className="text-green-900 dark:text-green-100">
                                        {formData.specs.transmissionType} {formData.specs.transmission ? `(${formData.specs.transmission})` : ''}
                                    </span>
                                </div>
                                {formData.specs.isElectric && (
                                    <div className="flex justify-between">
                                        <span className="text-green-700 dark:text-green-300 font-medium">Autonomía:</span>
                                        <span className="text-green-900 dark:text-green-100">{formData.specs.batteryRange}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div key={index} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isActive
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                        : isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}>
                                        {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                                    </div>
                                    <p className={`mt-2 text-xs font-medium ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`h-1 flex-1 mx-2 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Content */}
            <div className="glass-card p-8 rounded-3xl border-t border-white/50 dark:border-white/10 mb-6">
                {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Anterior
                </button>

                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/30"
                    >
                        Siguiente
                        <ArrowRight className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/30"
                    >
                        {loading ? 'Guardando...' : submitLabel}
                        <Check className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CarForm;
