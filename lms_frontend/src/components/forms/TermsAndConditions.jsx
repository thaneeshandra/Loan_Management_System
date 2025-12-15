import React from "react";
import { Field, useFormikContext } from "formik";
import PropTypes from "prop-types";

const TermsAndConditions = ({ disabled }) => {
  const { touched, errors, submitCount } = useFormikContext();

  // Show error only if form has been submitted at least once
  // AND there's an error with the agree field
  const showError = submitCount > 0 && errors.agree;

  return (
    <div className="col-span-full mt-4 flex items-start">
      <div className="flex items-center h-5">
        <Field
          id="agree"
          name="agree"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={disabled}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="agree" className="font-medium text-gray-700">
          I agree to the{" "}
          <a
            href="https://example.com/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            terms and conditions
          </a>
        </label>

        {/* Only show error if form has been submitted */}
        {showError && (
          <div className="text-red-500 text-sm mt-1">{errors.agree}</div>
        )}
      </div>
    </div>
  );
};

TermsAndConditions.propTypes = {
  disabled: PropTypes.bool,
};

export default TermsAndConditions;