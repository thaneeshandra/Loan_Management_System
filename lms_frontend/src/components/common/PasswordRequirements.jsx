import React, { useState } from 'react';

const PasswordRequirements = ({ password = "" }) => {
  const [showRequirements, setShowRequirements] = useState(false);

  const requirements = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: "One uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: "One number",
      test: (pwd) => /\d/.test(pwd),
    },
    {
      label: "One special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  return (
    <div className="mt-4 text-sm">
      <button
        type="button"
        onClick={() => setShowRequirements(!showRequirements)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17z"
          />
        </svg>
        {showRequirements ? "Hide password requirements" : "See password requirements"}
      </button>

      {showRequirements && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 p-3 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          {requirements.map((req, index) => {
            const isValid = req.test(password);
            return (
              <li key={index} className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isValid
                      ? "bg-green-500"
                      : password.length > 0
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                <span
                  className={`${
                    isValid
                      ? "text-green-600 dark:text-green-400"
                      : password.length > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {req.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PasswordRequirements;
