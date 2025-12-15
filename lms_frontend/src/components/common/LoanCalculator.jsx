import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LoanCalculator = () => {
  // State for inputs
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(24);
  // Fixed interest rate at 12%
  const interestRate = 0.12;

  // State for outputs
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Calculate EMI and total interest
  useEffect(() => {
    const monthlyRate = interestRate / 12;
    const numPayments = loanTerm;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    setMonthlyPayment(emi);
    setTotalInterest(emi * numPayments - loanAmount);
  }, [loanAmount, loanTerm, interestRate]);

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="max-w-xl mx-auto rounded-xl shadow-xl p-8 bg-white dark:bg-gray-800 dark:shadow-gray-900/50">

      {/* Loan Amount */}
      <div className="mb-6">
        <label
          htmlFor="loan-amount"
          className="block font-medium mb-2 text-gray-700 dark:text-gray-200"
        >
          Loan Amount:{" "}
          <span className="text-blue-600 dark:text-blue-400">
            {formatCurrency(loanAmount)}
          </span>
        </label>
        <input
          id="loan-amount"
          type="range"
          min="10000" // changed from 5000 to 10000
          max="500000"
          step="1000"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600 accent-blue-600 dark:accent-blue-400"
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">₹10,000</span> {/* updated label */}
          <span className="text-sm text-gray-500 dark:text-gray-400">₹5,00,000</span>
        </div>
      </div>

      {/* Loan Term */}
      <fieldset className="mb-6">
        <legend className="block font-medium mb-2 text-gray-700 dark:text-gray-200">
          Loan Term
        </legend>
        <div className="grid grid-cols-5 gap-2">
          {[12, 24, 36, 48, 60].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setLoanTerm(term)}
              className={`py-2 rounded-md font-medium transition-all duration-300
                ${loanTerm === term
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-600 dark:hover:text-white dark:border dark:border-gray-600"
                }`}
            >
              {term}
            </button>
          ))}
        </div>
        <div className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
          months
        </div>
      </fieldset>

      {/* Fixed Interest Rate Info */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold">
            Note
          </span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            The default interest rate is{" "}
            <span className="font-bold">12%</span>. You can change it in the
            settings.
          </span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Monthly Payment Card */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-blue-50 border border-blue-100 dark:bg-gray-700 dark:border-gray-600 text-center h-full">
          <span className="text-gray-700 dark:text-gray-300 mb-1">Monthly EMI</span>
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {formatCurrency(monthlyPayment)}
          </span>
        </div>
        {/* Total Interest Card */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-green-50 border border-green-100 dark:bg-gray-700 dark:border-gray-600 text-center h-full">
          <span className="text-gray-700 dark:text-gray-300 mb-1">Total Interest</span>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalInterest)}
          </span>
        </div>
        {/* Total Amount Card */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-indigo-50 border border-indigo-100 dark:bg-gray-700 dark:border-gray-600 text-center h-full">
          <span className="text-gray-700 dark:text-gray-300 mb-1">Total Amount</span>
          <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
            {formatCurrency(loanAmount + totalInterest)}
          </span>
        </div>
      </div>

      {/* Apply Now */}
      <Link
        to="/register"
        className="block w-full text-center py-4 rounded-lg font-medium shadow-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Apply Now
      </Link>
    </div>
  );
};

export default LoanCalculator;
