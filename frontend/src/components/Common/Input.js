import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  className = '',
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input-field ${error ? 'error' : ''} ${icon ? 'has-icon' : ''}`}
        />
      </div>
      
      {error && <div className="input-error">{error}</div>}
      {helperText && !error && <div className="input-helper">{helperText}</div>}
    </div>
  );
};

export default Input;