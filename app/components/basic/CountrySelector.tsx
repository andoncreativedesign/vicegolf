import type { SelectHTMLAttributes } from 'react';
import { getCountries } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';

type CountrySelectorProps = {
    label: string;
    error?: string;
    containerClassName?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function CountrySelector({
    label,
    error,
    containerClassName,
    className = '',
    id,
    ...selectProps
}: CountrySelectorProps) {
    const inputClasses = "w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    // Sort countries by name
    const countries = getCountries().sort((a, b) => (en[a] || '').localeCompare(en[b] || ''));

    return (
        <div className={containerClassName}>
            <label htmlFor={id} className={labelClasses}>
                {label}
                {selectProps.required && <span className="text-red-500"> *</span>}
            </label>
            <div className="relative">
                <select
                    id={id}
                    className={`${inputClasses} ${className} appearance-none`}
                    {...selectProps}
                >
                    <option value="" disabled>Select a country</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {en[country]}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}

export default CountrySelector;
