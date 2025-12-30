import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

type CustomInputFieldProps = {
  label: string;
  supportingText?: string;
  error?: string;
  containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const baseInputClasses =
  'w-full rounded-md border border-transparent bg-[#FAFAFA] px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black';

export function CustomInputFiled({
  label,
  supportingText,
  error,
  required,
  containerClassName,
  className = '',
  id,
  type = 'text',
  ...inputProps
}: CustomInputFieldProps) {
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

      <input
        id={inputId}
        type={type}
        required={required}
        className={`${baseInputClasses} ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`.trim()}
        {...inputProps}
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

export default CustomInputFiled;