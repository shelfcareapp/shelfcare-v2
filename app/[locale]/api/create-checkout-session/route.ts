import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req) {
  try {
    const { items } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success`,
      cancel_url: `${req.headers.origin}/payment-failure`
    });

    NextResponse.json(
      {
        message: 'Session created successfully',
        session
      },
      {
        status: 200
      }
    );
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    NextResponse.json(
      {
        message: 'Failed to create checkout session'
      },
      {
        status: 500
      }
    );
  }
}
