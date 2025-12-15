import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../services/settingsService';
import { toast } from 'react-toastify';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    interestRate: '',
    maxLoanAmount: '',
    minTenure: '',
    maxTenure: '',
    defaultTheme: 'light',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        toast.error('Failed to load settings');
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="interestRate"
          value={settings.interestRate}
          onChange={handleChange}
          placeholder="Interest Rate (%)"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="maxLoanAmount"
          value={settings.maxLoanAmount}
          onChange={handleChange}
          placeholder="Max Loan Amount"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="minTenure"
          value={settings.minTenure}
          onChange={handleChange}
          placeholder="Min Loan Tenure (months)"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="maxTenure"
          value={settings.maxTenure}
          onChange={handleChange}
          placeholder="Max Loan Tenure (months)"
          className="w-full border px-3 py-2 rounded"
        />
        <select
          name="defaultTheme"
          value={settings.defaultTheme}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SystemSettings;
