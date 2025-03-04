// src/components/SearchBar.jsx
import React from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <input
      type="text"
      placeholder="Search models..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      style={{ padding: '8px', margin: '10px', width: '300px' }}
    />
  );
}

export default SearchBar;