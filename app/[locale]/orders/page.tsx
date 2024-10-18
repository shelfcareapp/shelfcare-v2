'use client';

import { useState, useEffect } from 'react';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import Layout from 'components/common/Layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../firebase'; // Firebase Firestore import
import { loadStripe } from '@stripe/stripe-js'; // Stripe integration
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY); // Stripe public key

export default function OrdersPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false); // New state for button loading

  useEffect(() => {
    // Fetch orders from Firestore
    const fetchOrders = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'new') {
      return !order.paymentEnabled;
    }
    if (filter === 'old') {
      return order.paymentEnabled;
    }
    return true;
  });

  const sortedOrders = filteredOrders.filter((order) => {
    return (
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.services.some((service) =>
        service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Stripe payment for the entire order
  const handlePayment = async (order) => {
    setIsProcessing(true); // Show loading state
    const stripe = await stripePromise;

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Order ID: ${order.id}`
              },
              unit_amount: order.totalPrice * 100 // Convert to cents
            },
            quantity: 1
          }
        ]
      })
    });

    const { sessionId } = await res.json();

    // Redirect to Stripe checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error('Error redirecting to Stripe Checkout:', error.message);
    }

    setIsProcessing(false); // Reset loading state after redirection
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <Layout>
      <UserDashboardLayout>
        <div className="bg-white py-8">
          <div className="mx-auto lg:pb-24">
            <div className="max-w-xl mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Order History
              </h1>
              <p className="mt-2 text-sm text-gray-800">
                Check the status of recent orders, manage returns, and make
                payments.
              </p>
            </div>

            <div className="mt-16">
              <div className="overflow-x-auto">
                {sortedOrders.length === 0 && (
                  <p className="text-center text-gray-500">No orders found.</p>
                )}

                {currentOrders.map((order) => (
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
                          dateTime={order.orderDate}
                          className="text-gray-500"
                        >
                          {new Date(order.orderDate).toLocaleDateString()}
                        </time>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-700">
                          Order ID
                        </span>
                        <p className="text-gray-500">{order.id.slice(0, 10)}</p>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-700">
                          Total amount
                        </span>
                        <p className="text-gray-500">€{order.totalPrice}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <table className="w-full table-auto text-sm">
                        <thead>
                          <tr className="text-gray-700">
                            <th className="py-2 text-left">Service</th>
                            <th className="py-2 text-left">Additional Info</th>
                            <th className="py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.services.map((service, index) => (
                            <tr key={index}>
                              <td className="py-2">{service}</td>
                              <td className="py-2">
                                {order.additionalInfo || '—'}
                              </td>
                              <td className="py-2">{order.status || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Single payment button for the entire order */}
                    <div className="mt-4 text-right">
                      {order.paymentEnabled ? (
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
                ))}

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
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
