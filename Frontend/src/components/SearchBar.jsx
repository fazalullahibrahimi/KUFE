// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ placeholder, value, onSearch }) => {
  return (
    <div className='relative'>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className='w-full px-4 py-2 border rounded-lg'
      />
    </div>
  );
};

export default SearchBar;
