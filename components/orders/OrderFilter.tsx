import React from 'react';

const OrderFilter = ({ onFilterChange }) => {
  return (
    <div className="flex items-center gap-4 mt-6 w-full">
      <input
        type="text"
        placeholder="Search orders"
        onChange={(e) => onFilterChange('search', e.target.value)}
        className="rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900"
      />

      <select
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900"
      >
        <option value="">All statuses</option>
        <option value="paid">Paid</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default OrderFilter;
