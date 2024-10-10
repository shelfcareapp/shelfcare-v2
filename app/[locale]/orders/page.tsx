'use client';

import { useState } from 'react';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import Layout from 'components/common/Layout';

const orders = [
  {
    number: 'WU88191111',
    date: 'January 22, 2021',
    datetime: '2021-01-22',
    total: '€238.00',
    status: 'Delivered',
    serviceType: 'Tailoring',
    isPaid: true,
    additionalInfo: 'Waist Narrowing from Back Seam',
    products: [
      {
        id: 1,
        name: 'Trouser Leg Shortening',
        price: '€70.00',
        status: 'Delivered',
        imageSrc:
          'https://tailwindui.com/plus/img/ecommerce-images/order-history-page-02-product-01.jpg',
        imageAlt: 'Trouser leg shortening service.'
      }
    ],
    invoiceHref: '#'
  },
  {
    number: 'WU12345678',
    date: 'September 15, 2023',
    datetime: '2023-09-15',
    total: '€80.00',
    status: 'In Progress',
    serviceType: 'Cobbler',
    isPaid: false,
    additionalInfo: 'Sole replacement and polishing',
    products: [
      {
        id: 2,
        name: 'Shoe Sole Replacement',
        price: '€80.00',
        status: 'In Progress',
        imageSrc:
          'https://tailwindui.com/plus/img/ecommerce-images/order-history-page-02-product-02.jpg',
        imageAlt: 'Shoe sole replacement service.'
      }
    ],
    invoiceHref: '#'
  }
  // More orders...
];

const sortOrders = (orders) => {
  return orders.sort((a, b) => {
    if (!a.isPaid && a.status === 'In Progress') return -1;
    if (a.isPaid && a.status !== 'Delivered') return 1;
    return 0;
  });
};

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'new') {
      return !order.isPaid;
    }
    if (filter === 'old') {
      return order.isPaid;
    }
    if (filter === 'confirm') {
      return !order.isPaid && order.status === 'In Progress';
    }
    return true;
  });

  const sortedOrders = sortOrders(
    filteredOrders.filter((order) => {
      return (
        order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <UserDashboardLayout>
        <div className="bg-white">
          <div className="mx-auto lg:pb-24">
            <div className="max-w-xl mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Order History
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Check the status of recent orders, manage returns, and download
                invoices.
              </p>
            </div>

            <div className="mt-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'all' ? 'bg-primary text-white' : 'text-primary'
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setFilter('new')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'new' ? 'bg-primary text-white' : 'text-primary'
                  }`}
                >
                  New Orders
                </button>
                <button
                  onClick={() => setFilter('old')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'old' ? 'bg-primary text-white' : 'text-primary'
                  }`}
                >
                  Old Orders
                </button>
                <button
                  onClick={() => setFilter('confirm')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'confirm'
                      ? 'bg-primary text-white'
                      : 'text-primary'
                  }`}
                >
                  Order Confirmation
                </button>
              </div>
            </div>

            <div className="mt-16 overflow-y-auto">
              <h2 className="sr-only">Recent orders</h2>

              <div className="space-y-20 overflow-y-auto">
                {sortedOrders.length === 0 && (
                  <p className="text-center text-gray-500">No orders found.</p>
                )}

                {currentOrders.map((order) => (
                  <div key={order.number}>
                    <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                      <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-900">
                            Date placed
                          </dt>
                          <dd className="sm:mt-1">
                            <time dateTime={order.datetime}>{order.date}</time>
                          </dd>
                        </div>
                        <div className="flex justify-between pt-6 sm:block sm:pt-0">
                          <dt className="font-medium text-gray-900">
                            Order number
                          </dt>
                          <dd className="sm:mt-1">{order.number}</dd>
                        </div>
                        <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                          <dt>Total amount</dt>
                          <dd className="sm:mt-1">{order.total}</dd>
                        </div>
                      </dl>

                      <a
                        href={order.isPaid ? order.invoiceHref : '#'}
                        className="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                      >
                        {order.isPaid ? 'View Invoice' : 'Pay Now'}
                        <span className="sr-only">
                          for order {order.number}
                        </span>
                      </a>

                      {!order.isPaid && order.status === 'In Progress' && (
                        <button
                          onClick={() => {
                            /* Add order confirmation logic here */
                          }}
                          className="mt-6 w-full items-center justify-center rounded-md border border-gray-300 bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                        >
                          Confirm Order
                        </button>
                      )}
                    </div>

                    <table className="mt-4 w-full text-gray-500 sm:mt-6">
                      <caption className="sr-only">Products</caption>
                      <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                        <tr>
                          <th scope="col" className="py-3 pr-8 font-normal">
                            Product
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3 pr-8 font-normal sm:table-cell"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3 pr-8 font-normal sm:table-cell"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3 pr-8 font-normal sm:table-cell"
                          >
                            Service Type
                          </th>
                          <th
                            scope="col"
                            className="w-0 py-3 pr-8 font-normal sm:table-cell"
                          >
                            Additional Adjustments
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                        {order.products.map((product) => (
                          <tr key={product.id}>
                            <td className="py-6 pr-8">
                              <div className="flex items-center">
                                <img
                                  alt={product.imageAlt}
                                  src={product.imageSrc}
                                  className="mr-6 h-16 w-16 rounded object-cover object-center"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="mt-1 sm:hidden">
                                    {product.price}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="hidden py-6 pr-8 sm:table-cell">
                              {product.price}
                            </td>
                            <td className="hidden py-6 pr-8 sm:table-cell">
                              {product.status}
                            </td>
                            <td className="hidden py-6 pr-8 sm:table-cell">
                              {order.serviceType}
                            </td>
                            <td className="whitespace-nowrap py-6 text-left font-medium">
                              {order.additionalInfo}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <ul className="flex space-x-2">
                  {Array.from(
                    { length: Math.ceil(sortedOrders.length / itemsPerPage) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <li key={page}>
                      <button
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 border ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'bg-white text-primary'
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
