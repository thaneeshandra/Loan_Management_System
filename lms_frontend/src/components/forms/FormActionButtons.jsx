import React from "react";

const FormActionButtons = ({ 
  isSubmitting, 
  createdId, 
  navigateTo, 
  resetForm 
}) => {
  return !createdId ? (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full ${
        isSubmitting
          ? "bg-blue-400"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white py-2 px-4 rounded-md font-medium transition-colors`}
    >
      {isSubmitting ? "Submitting..." : "Submit Application"}
    </button>
  ) : (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={navigateTo}
        className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
      >
        Go to My Loans
      </button>
      <button
        type="button"
        onClick={resetForm}
        className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
      >
        Create New Application
      </button>
    </div>
  );
};

export default FormActionButtons;