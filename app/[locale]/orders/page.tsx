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
import { formatDateTime } from 'utils/formatDateTime';
import { TimeOptions, useTimeOptions } from 'hooks/useTimeOptions';
import { addDays, format, isAfter } from 'date-fns';
import { fi } from 'date-fns/locale/fi';

const filterStatus = {
  all: 'All',
  paid: 'Paid',
  unpaid: 'Unpaid'
};

export default function OrdersPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filter, setFilter] = useState(filterStatus.all);
  const t = useTranslations('order-history');
  const { pickupDates, returnDates } = useTimeOptions();
  const [updatedReturnDates, setUpdatedReturnDates] = useState<TimeOptions[]>(
    []
  );
  const [pickupOption, setPickupOption] = useState<TimeOptions | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<TimeOptions | null>(
    null
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersByUserId(user.uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (pickupOption) {
      const filteredDates = returnDates.filter((date) =>
        isAfter(date.date, addDays(pickupOption.date, 6))
      );
      setUpdatedReturnDates(filteredDates);

      if (
        deliveryOption &&
        !filteredDates.find(
          (date) => date.date.toString() === deliveryOption.date.toString()
        )
      ) {
        setDeliveryOption(null);
      }
    } else {
      setUpdatedReturnDates(returnDates);
    }
  }, [pickupOption, returnDates, deliveryOption]);

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === filterStatus.all ||
      (filter === filterStatus.paid && order.paymentStatus === 'paid') ||
      (filter === filterStatus.unpaid && order.paymentStatus !== 'paid');
    return matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPickupOptions = (order: Order) => (
    <div>
      <span className="block font-medium text-gray-700 text-sm">
        {t('pickup-date')}
      </span>
      {/* {order.pickupTime ? (
        <time className="text-gray-500 text-sm">
          {formatDateTime(order.pickupTime)}
        </time>
      ) : ( */}
      <select
        value={pickupOption?.date.toString() || order.pickupTime}
        onChange={(e) => {
          const selectedDate = pickupDates.find(
            (date) => date.date.toString() === e.target.value
          );
          setPickupOption(selectedDate || null);
          dispatch(
            updateOrderTimes({
              orderId: order.id,
              pickupTime: selectedDate?.date || null,
              deliveryTime: order.deliveryTime
            })
          );
        }}
        className="block w-full mt-2 px-2 py-1 border rounded-md text-gray-500"
      >
        <option value="">—</option>
        {pickupDates.map((date) => (
          <option key={date.date.toString()} value={date.date.toString()}>
            {format(date.date, 'EEEEEE dd.MM.yyyy', { locale: fi })} {date.time}
          </option>
        ))}
      </select>
      {/* )} */}
    </div>
  );

  const renderDeliveryDate = (order: Order) => (
    <div>
      <span className="block font-medium text-gray-700 text-sm">
        {t('return-date')}
      </span>
      {/* {order.deliveryTime ? (
        <time className="text-gray-500 text-sm">
          {formatDateTime(order.deliveryTime)}
        </time>
      ) : ( */}
      <select
        value={deliveryOption?.date.toString() || order.deliveryTime}
        onChange={(e) => {
          const selectedDate = updatedReturnDates.find(
            (date) => date.date.toString() === e.target.value
          );
          setDeliveryOption(selectedDate || null);
          dispatch(
            updateOrderTimes({
              orderId: order.id,
              pickupTime: order.pickupTime,
              deliveryTime: selectedDate?.date || null
            })
          );
        }}
        className="block w-full mt-2 px-2 py-1 border rounded-md text-gray-500"
        disabled={!pickupOption}
      >
        <option value="">—</option>
        {updatedReturnDates.map((date) => (
          <option key={date.date.toString()} value={date.date.toString()}>
            {format(date.date, 'EEEEEE dd.MM.yyyy', { locale: fi })} {date.time}
          </option>
        ))}
      </select>
      {/* )} */}
    </div>
  );

  return (
    <Layout>
      <UserDashboardLayout>
        <div className="bg-white py-8 p-4 md:p-8 lg:p-10">
          <div className="mx-auto lg:pb-24">
            <div className="max-w-xl mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                {t('title')}
              </h1>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {Object.values(filterStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`${
                    filter === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700'
                  } px-4 py-2 rounded-md shadow-md hover:bg-primary hover:text-white transition`}
                >
                  {t(`${status.toLowerCase()}`)}
                </button>
              ))}
            </div>

            <div className="mt-10">
              <div className="overflow-x-auto">
                {loading ? (
                  <p> {t('loading-orders')}</p>
                ) : (
                  currentOrders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                        <div>
                          <span className="block font-medium text-gray-700">
                            {t('date-placed')}
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
                            {t('order-id')}
                          </span>
                          <p className="text-gray-500">{order.id}</p>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-700">
                            {t('total-amount')}
                          </span>
                          <p className="text-gray-500">€{order.totalPrice}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 sm:grid-cols-3 gap-6">
                        {renderPickupOptions(order)}
                        {renderDeliveryDate(order)}
                      </div>

                      <div className="mt-6">
                        <table className="w-full table-auto text-sm">
                          <thead>
                            <tr className="text-gray-700">
                              <th className="py-2 text-left">
                                {' '}
                                {t('adjustments')}
                              </th>
                              <th className="py-2 text-left">
                                {' '}
                                {t('service-type')}
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

                      <div className="mt-4 text-right">
                        {order.paymentStatus === 'paid' ? (
                          <span className="text-green-600 font-semibold">
                            {t('paid')}
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              window.open(order?.paymentLink, '_blank')
                            }
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                          >
                            {t('pay-now')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}

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
                          className={`px-4 py-2 border rounded ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-white text-primary'
                          } hover:bg-primary hover:text-white transition`}
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
