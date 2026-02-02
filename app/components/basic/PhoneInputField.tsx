import type { InputHTMLAttributes } from 'react';
import { useId, useState, useRef, useEffect } from 'react';
import PhoneInput, { getCountries } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import en from 'react-phone-number-input/locale/en';
import 'react-phone-number-input/style.css';
import './PhoneInputField.css';

type PhoneInputFieldProps = {
    label: string;
    supportingText?: string;
    error?: string;
    containerClassName?: string;
    value: string;
    onChange: (value: string | undefined) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

const CustomCountrySelect = ({ value, onChange, labels }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCountry = value;
    const Flag = selectedCountry ? flags[selectedCountry as keyof typeof flags] : null;

    return (
        <div className="country-dropdown-container" ref={containerRef}>
            <button
                type="button"
                className="country-dropdown-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="PhoneInputCountryIcon">
                    {Flag && <Flag title={selectedCountry} />}
                </div>
                <div className="PhoneInputCountrySelectArrow" />
            </button>

            {isOpen && (
                <ul className="country-dropdown-list" role="listbox">
                    {getCountries().map((country) => {
                        const CountryFlag = flags[country as keyof typeof flags];
                        const label = en[country as keyof typeof en];
                        return (
                            <li
                                key={country}
                                className={`country-dropdown-item ${selectedCountry === country ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(country);
                                    setIsOpen(false);
                                }}
                                role="option"
                                aria-selected={selectedCountry === country}
                            >
                                <div className="PhoneInputCountryIcon">
                                    <CountryFlag title={country} />
                                </div>
                                <span className="country-dropdown-label">{label}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export function PhoneInputField({
    label,
    supportingText,
    error,
    required,
    containerClassName,
    className = '',
    id,
    value,
    onChange,
    ...inputProps
}: PhoneInputFieldProps) {
    const generatedId = useId();
    const inputId = id ?? inputProps.name ?? generatedId;

    return (
        <div className={`flex flex-col space-y-3 ${containerClassName ?? ''}`}>
            <label htmlFor={inputId} className="text-[13px] font-semibold text-[#1f2937]">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            {supportingText && (
                <p className="text-[13px] text-[#6b7280]">{supportingText}</p>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .PhoneInputCustom {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    width: 100% !important;
                    gap: 12px !important;
                    height: 48px !important;
                }
                
                .PhoneInputCustom .PhoneInputInput {
                    flex: 1 !important;
                    height: 48px !important;
                    min-width: 0 !important;
                    background: #FAFAFA !important;
                    border: 1px solid #ddd !important;
                    border-radius: 6px !important;
                    padding: 0 16px !important;
                    font-size: 16px !important;
                    outline: none !important;
                    color: #000 !important;
                }
                .PhoneInputCustom .PhoneInputInput:focus {
                    border-color: black !important;
                    box-shadow: 0 0 0 1px black !important;
                    background: white !important;
                }
                
                .country-dropdown-container {
                    position: relative;
                    flex-shrink: 0;
                }

                .country-dropdown-button {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 70px !important;
                    height: 48px !important;
                    background: #FAFAFA !important;
                    border: 1px solid #ddd !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    padding: 0 !important;
                }

                .PhoneInputCountryIcon {
                    width: 24px !important;
                    height: 16px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    flex-shrink: 0 !important;
                }

                .PhoneInputCountryIcon img,
                .PhoneInputCountryIcon svg {
                    width: 24px !important;
                    height: 16px !important;
                    display: block !important;
                    object-fit: contain !important;
                }

                .PhoneInputCountrySelectArrow {
                    width: 0.35em !important;
                    height: 0.35em !important;
                    border-left: 1px solid currentColor !important;
                    border-bottom: 1px solid currentColor !important;
                    transform: rotate(-45deg) !important;
                    margin-left: 8px !important;
                    margin-top: -3px !important;
                    opacity: 0.5 !important;
                    flex-shrink: 0 !important;
                }

                .country-dropdown-list {
                    position: absolute;
                    top: calc(100% + 5px);
                    left: 0;
                    width: 280px;
                    max-height: 300px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    z-index: 1000;
                    overflow-y: auto;
                    padding: 8px 0;
                    margin: 0;
                    list-style: none;
                }

                .country-dropdown-item {
                    display: flex !important;
                    align-items: center !important;
                    padding: 10px 16px !important;
                    gap: 12px !important;
                    cursor: pointer !important;
                    transition: background 0.2s !important;
                }

                .country-dropdown-item:hover {
                    background: #f3f4f6 !important;
                }

                .country-dropdown-item.selected {
                    background: #eff6ff !important;
                }

                .country-dropdown-label {
                    font-size: 14px !important;
                    color: #1f2937 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
            `}} />
            <div className={`phone-input-root ${error ? 'phone-input-error' : ''}`}>
                <PhoneInput
                    id={inputId}
                    international
                    defaultCountry="AE"
                    value={value}
                    flags={flags}
                    onChange={onChange}
                    required={required}
                    className="PhoneInputCustom"
                    inputComponent={"input"}
                    countrySelectComponent={CustomCountrySelect}
                    {...inputProps}
                />
            </div>

            {error && (
                <p className="text-xs text-red-600">{error}</p>
            )}
        </div>
    );
}

export default PhoneInputField;
