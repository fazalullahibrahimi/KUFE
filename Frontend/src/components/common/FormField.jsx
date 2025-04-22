import React from "react"
const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  required = false,
  error,
  className = "",
}) => {
  // Render different input types
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required={required}
          >
            <option value="">Select {label}</option>
            {options &&
              options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        )
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required={required}
            rows={4}
          ></textarea>
        )
      case "date":
        return (
          <input
            type="date"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required={required}
          />
        )
      case "number":
        return (
          <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required={required}
          />
        )
      case "file":
        return (
          <input
            type="file"
            id={name}
            name={name}
            onChange={onChange}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required={required}
          />
        )
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required={required}
          />
        )
    }
  }

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default FormField
