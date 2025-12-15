import React from 'react';

const EMIBreakdownTable = ({ emiBreakdown, formatCurrency }) => (
  <div className="overflow-x-auto mb-6">
    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">EMI Breakdown</h3>
    <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-600">
          <th className="border px-4 py-2">Month</th>
          <th className="border px-4 py-2">Principal Paid</th>
          <th className="border px-4 py-2">Interest Paid</th>
          <th className="border px-4 py-2">Remaining Balance</th>
        </tr>
      </thead>
      <tbody>
        {emiBreakdown.map((row) => (
          <tr key={row.month} className="text-center">
            <td className="border px-4 py-2">{row.month}</td>
            <td className="border px-4 py-2">{formatCurrency(row.principal)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.interest)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.balance)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EMIBreakdownTable;