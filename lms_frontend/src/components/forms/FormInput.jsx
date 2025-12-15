import React from 'react';
import { Field, ErrorMessage } from 'formik';

const FormInput = ({
  type = 'text',
  name,
  label,
  placeholder,
  isPassword = false,
  showPassword,
  togglePassword,
  as = 'input',
  inputClassName = "",
  labelClassName = "",
  className = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 mb-4"
}) => {
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  // Merge dark mode classes with any passed inputClassName
  const inputClass = `${isPassword ? className.replace("mb-4", "") : className} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${inputClassName}`;

  return (
    <div className={`mb-4 ${isPassword ? "relative" : ""}`}>
      {label && (
        <label htmlFor={name} className={`block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 ${labelClassName}`}>
          {label}
        </label>
      )}

      <div className="relative">
        <Field
          as={as}
          type={inputType}
          name={name}
          id={name}
          placeholder={placeholder}
          className={inputClass}
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙉" : "🙈"}
          </button>
        )}
      </div>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 dark:text-red-400 text-sm text-center mt-1"
      />
    </div>
  );
};

export default FormInput;
