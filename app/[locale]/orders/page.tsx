'use client';

import { useState, useEffect } from 'react';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import Layout from 'components/common/Layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import {
  fetchOrdersByUserId,
  updateOrderTimes
} from 'store/slices/orders-slice';
import { useTranslations } from 'next-intl';
import { auth } from '../../../firebase';
import { Order } from 'types';
import PickupReturnTime from 'components/PickupReturnTime';
import { formatDateTime } from 'utils/formatDateTime';

export default function OrdersPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations('user-dashboard');

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersByUserId(user.uid));
    }
  }, [user, dispatch]);

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  const filteredOrders = orders.filter((order) => {
    return (
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(order.services).some((service: any) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePayment = async (order: any) => {
    // use searchParams to pass the order id and total price to the payment page
    router.push(`/payment?orderId=${order.id}&amount=${order.totalPrice}`);
  };

  const handleTimeUpdate = (orderId: string, pickupTime, deliveryTime) => {
    dispatch(updateOrderTimes({ orderId, pickupTime, deliveryTime }));
  };

  return (
    <Layout>
      <UserDashboardLayout>
        <div className="bg-white py-8 p-4 md:p-8 lg:p-10">
          <div className="mx-auto lg:pb-24">
            <div className="max-w-xl mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                {t('order-history')}
              </h1>
              <p className="mt-2 text-sm text-gray-800">
                {t('orders-subtitle')}
              </p>
            </div>

            <div className="mt-16">
              <div className="overflow-x-auto">
                {loading ? (
                  <p>Loading orders...</p>
                ) : (
                  currentOrders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                        <div>
                          <span className="block font-medium text-gray-700">
                            Date placed
                          </span>
                          <time
                            dateTime={order.createdAt as unknown as string}
                            className="text-gray-500"
                          >
                            {formatDateTime(
                              order.createdAt as unknown as string
                            )}
                          </time>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-700">
                            Order ID
                          </span>
                          <p className="text-gray-500">{order.id}</p>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-700">
                            Total amount
                          </span>
                          <p className="text-gray-500">€{order.totalPrice}</p>
                        </div>
                      </div>

                      {(order.paymentStatus !== 'paid' && !order.pickupTime) ||
                        (!order.deliveryTime && (
                          <PickupReturnTime
                            order={order}
                            onUpdateTimes={(pickupTime, returnTime) =>
                              handleTimeUpdate(order.id, pickupTime, returnTime)
                            }
                          />
                        ))}

                      {/* Pick up time and delivery time */}
                      <div className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <span className="block font-medium text-gray-700">
                              Pick up time
                            </span>
                            <time
                              dateTime={order.pickupTime}
                              className="text-gray-500"
                            >
                              {formatDateTime(order.pickupTime)}
                            </time>
                          </div>
                          <div>
                            <span className="block font-medium text-gray-700">
                              Delivery time
                            </span>
                            <time
                              dateTime={order.deliveryTime}
                              className="text-gray-500"
                            >
                              {formatDateTime(order.deliveryTime)}
                            </time>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <table className="w-full table-auto text-sm">
                          <thead>
                            <tr className="text-gray-700">
                              <th className="py-2 text-left">Service</th>
                              <th className="py-2 text-left">
                                Additional Info
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {Object.values(order.services).map(
                              (service: any, index: number) => (
                                <tr key={index}>
                                  <td className="py-2">{service.name}</td>
                                  <td className="py-2">
                                    {service.parent || '—'}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Single payment button for the entire order */}
                      <div className="mt-4 text-right">
                        {order.paymentStatus === 'paid' ? (
                          <span className="text-green-600 font-bold">Paid</span>
                        ) : (
                          <button
                            onClick={() => handlePayment(order)}
                            className={`${
                              isProcessing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary'
                            } text-white px-4 py-2 rounded-md`}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Pay Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <ul className="flex space-x-2">
                    {Array.from(
                      {
                        length: Math.ceil(filteredOrders.length / itemsPerPage)
                      },
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
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
