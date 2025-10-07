// src/components/admin/EventList/EventFilter.jsx
import React, { useState } from "react";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";

const EventFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const applyFilter = () => onFilter(filters);
  const clearFilters = () => {
    const emptyFilters = { name: "", location: "", status: "", startDate: "", endDate: "" };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
   
    <div className="card mb-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
        🔍 Filter Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
    
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm text-gray-500 dark:text-gray-400 mb-1">Event Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter event name..."
            value={filters.name}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="location" className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter location..."
            value={filters.location}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="REGISTRATION">Registration</option>
            <option value="READY">Ready</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

   
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

     
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm text-gray-500 dark:text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            id="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

    
      <div className="mt-4 flex gap-2 flex-wrap justify-end">
        <button
          onClick={applyFilter}
          className="
            flex items-center gap-2 
            bg-secondary-400 text-white 
            dark:bg-secondary-700 
            px-4 py-2 rounded-xl shadow hover:bg-secondary-500 
          "
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
          Apply
        </button>

     
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 font-semibold rounded-lg shadow hover:bg-secondary-200 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <Cross2Icon className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default EventFilter;
