import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const AutocompleteInput = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder,
    required = false,
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Filter options based on current value
        if (value) {
            const filtered = options.filter(option =>
                option.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [value, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const newValue = typeof e === 'string' ? e : e.target.value;

        // If onChange expects a string, pass the value directly
        // If it expects an event, create a synthetic event
        if (typeof onChange === 'function') {
            if (name) {
                // Create synthetic event for form-like usage
                onChange({
                    target: {
                        name,
                        value: newValue
                    }
                });
            } else {
                // Pass value directly for simple usage
                onChange(newValue);
            }
        }
        setIsOpen(true);
    };

    const handleSelectOption = (option) => {
        // If onChange expects a string, pass the value directly
        // If it expects an event, create a synthetic event
        if (typeof onChange === 'function') {
            if (name) {
                // Create synthetic event for form-like usage
                onChange({
                    target: {
                        name,
                        value: option
                    }
                });
            } else {
                // Pass value directly for simple usage
                onChange(option);
            }
        }
        setIsOpen(false);
    };

    const handleFocus = () => {
        if (!disabled) {
            setIsOpen(true);
        }
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    required={required}
                    disabled={disabled}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                    placeholder={placeholder}
                    autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute z-[100] w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredOptions.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectOption(option)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between group transition-colors"
                        >
                            <span className="text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {option}
                            </span>
                            {value === option && (
                                <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteInput;
