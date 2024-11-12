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
import { useLocale, useTranslations } from 'next-intl';
import { auth } from '../../../firebase';
import { Order } from 'types';
import { formatDateTime } from 'utils/formatDateTime';
import { useTimeOptions } from 'hooks/useTimeOptions';
import { addDays, format, isAfter, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale/fi';
import { toast } from 'react-toastify';

const filterStatus = {
  all: 'All',
  paid: 'Paid',
  unpaid: 'Unpaid'
};

const convertNameToFinnish = (name, locale) => {
  if (locale === 'fi') {
    switch (name) {
      case 'tailoring':
        return 'ompelimo';
      case 'cobbler':
        return 'suutari';
      case 'laundry':
        return 'pesula';
    }
  }
};

export default function OrdersPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locale = useLocale();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filter] = useState(filterStatus.all);
  const t = useTranslations('order-history');
  const { pickupDates, returnDates } = useTimeOptions();
  const [pickupOptions, setPickupOptions] = useState({});
  const [deliveryOptions, setDeliveryOptions] = useState({});
  const [updatedReturnDates, setUpdatedReturnDates] = useState({});

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersByUserId(user.uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const defaultPickupOptions = {};
    const defaultDeliveryOptions = {};
    orders.forEach((order) => {
      defaultPickupOptions[order.id] = order.pickupTime || null;
      defaultDeliveryOptions[order.id] = order.deliveryTime || null;
    });
    setPickupOptions(defaultPickupOptions);
    setDeliveryOptions(defaultDeliveryOptions);
  }, [orders]);

  const handlePickupChange = (orderId, dateValue) => {
    const selectedPickup =
      pickupDates.find((date) => date.date === dateValue) || null;
    setPickupOptions((prev) => ({
      ...prev,
      [orderId]: selectedPickup
    }));
    if (selectedPickup) updateReturnDatesForOrder(orderId, selectedPickup);
  };

  const handleDeliveryChange = (orderId, dateValue) => {
    const selectedDelivery =
      updatedReturnDates[orderId].find((date) => date.date === dateValue) ||
      null;
    setDeliveryOptions((prev) => ({
      ...prev,
      [orderId]: selectedDelivery
    }));
  };

  const updateReturnDatesForOrder = (orderId, selectedPickup) => {
    const filteredDates = returnDates.filter((date) =>
      isAfter(new Date(date.date), addDays(new Date(selectedPickup.date), 6))
    );
    setUpdatedReturnDates((prev) => ({
      ...prev,
      [orderId]: filteredDates
    }));
    if (
      deliveryOptions[orderId] &&
      !filteredDates.some(
        (date) => date.date === deliveryOptions[orderId]?.date
      )
    ) {
      setDeliveryOptions((prev) => ({
        ...prev,
        [orderId]: null
      }));
    }
  };

  const renderPickupOptions = (order: Order) => {
    const orderId = order.id;
    const defaultValue =
      order.pickupTime.date !== ''
        ? `${format(order?.pickupTime?.date, 'dd.MM.yyyy', {
            locale: fi
          })} ${order?.pickupTime?.time}`
        : '--';

    return (
      <select
        onChange={(e) => handlePickupChange(orderId, e.target.value)}
        value={pickupOptions[orderId]?.date.toString() || defaultValue}
        className="w-full p-2 rounded-lg border border-gray-200"
      >
        <option value="">{defaultValue} </option>
        {pickupDates.map((date, index) => (
          <option key={index} value={date.date.toString()}>
            {format(date.date, 'EEEEEE dd.MM.yyyy', { locale: fi })} {date.time}
          </option>
        ))}
      </select>
    );
  };

  const renderDeliveryOptions = (order: Order) => {
    const orderId = order.id;
    const defaultValue =
      order?.deliveryTime?.date !== ''
        ? `${format(order?.deliveryTime?.date, 'dd.MM.yyyy', {
            locale: fi
          })} ${order?.deliveryTime?.time}`
        : '--';

    return (
      <select
        onChange={(e) => handleDeliveryChange(orderId, e.target.value)}
        value={deliveryOptions[orderId]?.date.toString() || defaultValue}
        className="w-full p-2 rounded-lg border border-gray-200"
      >
        <option value="">{defaultValue}</option>
        {updatedReturnDates[orderId]?.map((date, index) => (
          <option key={index} value={date.date.toString()}>
            {format(date.date, 'EEEEEE dd.MM.yyyy', { locale: fi })} {date.time}
          </option>
        ))}
      </select>
    );
  };

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

            {/* <div className="flex items-center gap-4 mb-6">
              {Object.values(filterStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`${
                    filter === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700'
                  } px-4 py-2 rounded-md hover:bg-primary hover:text-white transition`}
                >
                  {t(`${status.toLowerCase()}`)}
                </button>
              ))}
            </div> */}

            <div className="mt-10">
              <div className="overflow-x-auto">
                {loading ? (
                  <p> {t('loading-orders')}</p>
                ) : currentOrders.length === 0 ? (
                  <p> {t('no-orders')}</p>
                ) : (
                  currentOrders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="mb-8 rounded-lg border border-gray-200 bg-white p-6"
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
                        {renderDeliveryOptions(order)}
                        <div>
                          <button
                            onClick={() => {
                              dispatch(
                                updateOrderTimes({
                                  orderId: order.id,
                                  pickupTime: pickupOptions[order.id] || {
                                    date: '',
                                    time: ''
                                  },
                                  deliveryTime: deliveryOptions[order.id] || {
                                    date: '',
                                    time: ''
                                  }
                                })
                              );
                              toast.success(
                                locale === 'fi'
                                  ? 'Aikavaraus on päivitetty onnistuneesti!'
                                  : 'Time reservation has been updated successfully!'
                              );
                            }}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                          >
                            {locale === 'fi' ? 'Tallenna' : 'Save'}
                          </button>
                        </div>
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
                                    {convertNameToFinnish(
                                      service.parent,
                                      locale
                                    ) || '—'}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* <div className="mt-4 text-right">
                        {order.paymentEnabled === true ? (
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
                      </div> */}
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
