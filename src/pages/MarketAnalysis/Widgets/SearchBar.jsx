import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="sm:max-w-sm">
      <div className="mt-2 flex rounded-md shadow-sm">
        <input
          type="text"
          placeholder="Search for a Stock..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm bg-gray-50">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </div>
    </form>
  );
};

export default SearchBar;
