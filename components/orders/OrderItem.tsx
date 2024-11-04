'use client';

import React, { useState } from 'react';
import OrderDetailsModal from './OrderDetailsModal';

const OrderItem = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-y-4 py-6">
      <dl className="flex-1">
        <dt className="text-base font-medium text-gray-500">Order ID:</dt>
        <dd className="text-base font-semibold text-gray-900">
          <a href="#" className="hover:underline">
            #{order.id}
          </a>
        </dd>
      </dl>
      <dl className="flex-1">
        <dt className="text-base font-medium text-gray-500">Date:</dt>
        <dd className="text-base font-semibold text-gray-900">
          {new Date(order.createdAt).toLocaleDateString()}
        </dd>
      </dl>
      <dl className="flex-1">
        <dt className="text-base font-medium text-gray-500">Price:</dt>
        <dd className="text-base font-semibold text-gray-900">
          ${order.totalPrice}
        </dd>
      </dl>
      <dl className="flex-1">
        <dt className="text-base font-medium text-gray-500">Status:</dt>
        <dd className="text-base font-semibold text-yellow-600">In Progress</dd>
      </dl>
      <button
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
        onClick={() => setIsModalOpen(true)}
      >
        View details
      </button>

      {isModalOpen && (
        <OrderDetailsModal
          order={order}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderItem;
