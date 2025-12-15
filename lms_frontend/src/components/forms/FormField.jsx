import React from "react";
import { Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";

const FormField = ({
  label,
  name,
  type = "text",
  as,
  options,
  disabled = false,
  required = false,
  min,
  max,
  step,
  readOnly = false,
  className = "",
  helpText,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {as === "select" ? (
        <Field
          as="select"
          id={name}
          name={name}
          disabled={disabled}
          className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            ${className} ${readOnly ? "bg-gray-50 dark:bg-gray-900" : ""}`}
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      ) : (
        <Field
          type={type}
          id={name}
          name={name}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            ${className} ${readOnly ? "bg-gray-50 dark:bg-gray-900" : ""}`}
        />
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />

      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helpText}</p>
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  as: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  helpText: PropTypes.string,
};

export default FormField;