'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from 'components/PaymentForm';
import { useSearchParams } from 'next/navigation';

console.log(
  'process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Payment() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('orderId');

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount} orderId={orderId} />
    </Elements>
  );
}
