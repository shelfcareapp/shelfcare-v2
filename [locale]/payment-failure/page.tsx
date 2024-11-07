'use client';
import Link from 'next/link';
import Layout from 'components/common/Layout';

export default function PaymentFailure() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-700">There was an issue with your payment.</p>
          <Link href="/orders">
            <a className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-lg">
              Go to Orders
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
