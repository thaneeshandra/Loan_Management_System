import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FiDollarSign, FiPercent, FiCalendar, FiCalculator } from 'react-icons/fi';

const EMICalculator = () => {
  const { theme } = useContext(ThemeContext);
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const calculateEMI = () => {
    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
      return;
    }

    const monthlyRate = rate / (12 * 100);
    const emiAmount = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                     (Math.pow(1 + monthlyRate, tenure) - 1);
    
    const totalAmountPayable = emiAmount * tenure;
    const totalInterestPayable = totalAmountPayable - principal;

    setEmi(Math.round(emiAmount));
    setTotalAmount(Math.round(totalAmountPayable));
    setTotalInterest(Math.round(totalInterestPayable));
  };

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, tenure]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <FiCalculator className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">EMI Calculator</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Loan Details</h4>
          
          {/* Principal Amount */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiDollarSign className="w-4 h-4" />
              Loan Amount (Principal)
            </label>
            <div className="relative">
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter loan amount"
                min="1000"
                max="10000000"
                step="1000"
              />
              <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">₹</span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000000"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>₹1,000</span>
              <span>₹50,00,000</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiPercent className="w-4 h-4" />
              Interest Rate (Annual)
            </label>
            <div className="relative">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter interest rate"
                min="1"
                max="30"
                step="0.1"
              />
              <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiCalendar className="w-4 h-4" />
              Loan Tenure
            </label>
            <div className="relative">
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter tenure"
                min="1"
                max="360"
              />
              <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">months</span>
            </div>
            <input
              type="range"
              min="1"
              max="360"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1 month</span>
              <span>30 years</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Calculation Results</h4>
          
          {/* EMI Result Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-2">Monthly EMI</p>
              <p className="text-3xl font-bold">{formatCurrency(emi)}</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Principal Amount</p>
              <p className="text-xl font-semibold text-green-700 dark:text-green-300">{formatCurrency(principal)}</p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
              <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Total Interest</p>
              <p className="text-xl font-semibold text-orange-700 dark:text-orange-300">{formatCurrency(totalInterest)}</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg sm:col-span-2">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Amount Payable</p>
              <p className="text-xl font-semibold text-purple-700 dark:text-purple-300">{formatCurrency(totalAmount)}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Loan Summary</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Loan Term:</span>
                <span className="text-gray-900 dark:text-white">{tenure} months ({Math.round(tenure/12)} years)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Interest Rate:</span>
                <span className="text-gray-900 dark:text-white">{rate}% per annum</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Interest %:</span>
                <span className="text-gray-900 dark:text-white">{((totalInterest/principal) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setPrincipal(100000);
                setRate(10);
                setTenure(12);
              }}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
            >
              Reset
            </button>
            <button 
              onClick={() => {
                const result = `EMI: ${formatCurrency(emi)}\nPrincipal: ${formatCurrency(principal)}\nInterest: ${formatCurrency(totalInterest)}\nTotal: ${formatCurrency(totalAmount)}`;
                navigator.clipboard.writeText(result);
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Copy Results
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>Disclaimer:</strong> This is an indicative EMI calculator. Actual EMI may vary based on bank policies, 
          processing fees, and other charges. Please consult with your loan officer for accurate calculations.
        </p>
      </div>
    </div>
  );
};

export default EMICalculator;