import React from 'react';
import './index.css';

const Header = ({ searchTerm, onSearchChange, typeFilter, onTypeChange, allTypes }) => {
  return (
    <div className="header">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="type-select"
      >
        {allTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default Header;
