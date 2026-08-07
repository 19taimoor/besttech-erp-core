import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import "./FormField.css";

interface FieldWrapperProps {
  label: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
}

function FieldWrapper({ label, error, htmlFor, children }: FieldWrapperProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <span className="form-field-error">{error}</span>}
    </div>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputField({ label, error, id, ...props }: InputFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldWrapper label={label} error={error} htmlFor={fieldId}>
      <input id={fieldId} className={error ? "has-error" : ""} {...props} />
    </FieldWrapper>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export function SelectField({ label, error, id, options, placeholder, ...props }: SelectFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldWrapper label={label} error={error} htmlFor={fieldId}>
      <select id={fieldId} className={error ? "has-error" : ""} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
