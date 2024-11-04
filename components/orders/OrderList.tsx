'use client';

import React, { useState, useEffect } from 'react';
import OrderFilter from './OrderFilter';
import OrderItem from './OrderItem';

const OrderList = ({ orders }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [filters, setFilters] = useState({ status: '', search: '' });

  const applyFilters = () => {
    const filtered = orders.filter((order) => {
      const statusMatch = filters.status
        ? order.status === filters.status
        : true;
      const searchMatch = filters.search
        ? order.customerName
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        : true;
      return statusMatch && searchMatch;
    });
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

  const handleFilterChange = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
        <OrderFilter onFilterChange={handleFilterChange} />

        <div className="mt-6 divide-y">
          {filteredOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderList;
