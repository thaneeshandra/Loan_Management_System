import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import loanSchema from "../../utils/loanSchema";
import api from "../../services/api";
import DocumentUploader from "../../components/user/DocumentUploader";
import FormField from "../../components/forms/FormField";
import FormActionButtons from "../../components/forms/FormActionButtons";
import TermsAndConditions from "../../components/forms/TermsAndConditions";
import LoanInterestRateHandler from "../../components/forms/LoanInterestRateHandler";
import { useNotification } from "../../context/NotificationContext";
import { LOAN_TYPES, EMPLOYMENT_TYPES } from "../../constants/loanConstants";

const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [createdLoanId, setCreatedLoanId] = useState(null);

  // Initial form values
  const initialValues = {
    loanType: "",
    employmentType: "",
    amountRequested: "",
    interestRate: "",
    loanTenure: "",
    agree: false,
  };

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const loanApplication = {
        loanType: values.loanType,
        employmentType: values.employmentType,
        amountRequested: parseFloat(values.amountRequested),
        interestRate: parseFloat(values.interestRate),
        loanTenure: parseInt(values.loanTenure),
      };

      const response = await api.post("/loans", loanApplication);
      const loanId = response.data.id;
      setCreatedLoanId(loanId);
      success("Loan application submitted successfully! You can now upload documents.");
    } catch (err) {
      error(err.response?.data?.message || "Failed to submit loan application");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCreatedLoanId(null);
  };

  const navigateToLoans = () => navigate("/loans/my-loans");

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Loan Application
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={loanSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LoanInterestRateHandler loanTypesData={LOAN_TYPES} />

              <FormField
                label="Loan Type"
                name="loanType"
                as="select"
                options={LOAN_TYPES}
                disabled={!!createdLoanId}
                required
                labelClass="text-gray-700 dark:text-gray-200"
              />

              <FormField
                label="Employment Type"
                name="employmentType"
                as="select"
                options={EMPLOYMENT_TYPES}
                disabled={!!createdLoanId}
                required
                labelClass="text-gray-700 dark:text-gray-200"
              />

              <FormField
                label="Amount Requested (₹)"
                name="amountRequested"
                type="number"
                min="1000"
                max="1000000"
                step="1000"
                disabled={!!createdLoanId}
                required
                helpText="Minimum: ₹1,000"
                labelClass="text-gray-700 dark:text-gray-200"
                inputClass="bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />

              <FormField
                label="Loan Tenure (Years)"
                name="loanTenure"
                type="number"
                min="1"
                max="30"
                disabled={!!createdLoanId}
                required
                helpText="1-30 years"
                labelClass="text-gray-700 dark:text-gray-200"
                inputClass="bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />

              <FormField
                label="Interest Rate (%)"
                name="interestRate"
                type="text"
                readOnly
                disabled={!!createdLoanId}
                helpText="Based on loan type"
                labelClass="text-gray-700 dark:text-gray-200"
                inputClass="bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />

              <TermsAndConditions values={values} disabled={!!createdLoanId} />

              <div className="col-span-full mt-6">
                <FormActionButtons
                  isSubmitting={isSubmitting}
                  createdId={createdLoanId}
                  navigateTo={navigateToLoans}
                  resetForm={resetForm}
                  buttonClass="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {createdLoanId && <DocumentUploader loanId={createdLoanId} />}
    </div>
  );
};

export default LoanApplicationForm;
