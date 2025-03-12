// src/components/InputField.jsx
import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
      />
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  );
};

export default InputField;
