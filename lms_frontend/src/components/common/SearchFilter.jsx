// src/components/common/SearchFilter.jsx
import React, { useState } from 'react';

const SearchFilter = ({ onFilter }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onFilter(value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search by loan type..."
        className="w-full px-4 py-2 border rounded shadow-sm"
      />
    </div>
  );
};

export default SearchFilter;
