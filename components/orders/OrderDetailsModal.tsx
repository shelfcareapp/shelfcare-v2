import { Dialog } from '@headlessui/react';
import React from 'react';

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            Order Details
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Detailed view of order #{order.id}.
          </Dialog.Description>

          <div className="mt-4">
            <p className="text-sm text-gray-700">
              <strong>Date:</strong>{' '}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Total Price:</strong> ${order.totalPrice}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Customer:</strong> {order.customerName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {order.customerEmail}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-semibold text-gray-900">Services</h3>
            <ul className="mt-2 space-y-2">
              {order.services.map((service) => (
                <li key={service.id} className="border p-2 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Service:</strong> {service.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Category:</strong> {service.parent}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Quantity:</strong> {service.quantity}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Price:</strong> ${service.price}
                  </p>
                  {service.subOptions.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600">
                      <strong>Options:</strong>
                      {service.subOptions.map((option, index) => (
                        <li key={index}>
                          {option.name} ({option.price})
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full rounded-lg bg-indigo-600 text-white py-2"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OrderDetailsModal;
