import React from 'react';

const LoanEligibilityChecker = ({
  monthlyIncome,
  setMonthlyIncome,
  monthlyExpenses,
  setMonthlyExpenses,
  eligibleEMI,
  eligibleLoan,
  formatCurrency,
}) => (
  <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Loan Eligibility Estimator</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Monthly Income</label>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Monthly Expenses</label>
        <input
          type="number"
          value={monthlyExpenses}
          onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
          className="w-full px-2 py-1 border rounded"
        />
      </div>
    </div>
    <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
      <p>Eligible EMI: <strong>{formatCurrency(eligibleEMI)}</strong></p>
      <p>Eligible Loan Amount: <strong>{formatCurrency(eligibleLoan)}</strong></p>
    </div>
  </div>
);

export default LoanEligibilityChecker;