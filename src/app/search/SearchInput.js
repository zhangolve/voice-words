import React, { useState } from "react";

const SearchBar = ({ handleSearch, inputRef }) => {
  const [search, setSearch] = useState("");
  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSearch} className="w-full max-w-lg">
        <div className="flex items-stretch border rounded overflow-hidden shadow-lg">
          <input
            type="text"
            className="px-4 py-2 w-full text-gray-700 leading-tight focus:outline-none"
            id="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={inputRef}
          />
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
