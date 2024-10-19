import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia'
  });

  try {
    const body = await req.json();
    const items = body.items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success`,
      cancel_url: `${req.headers.origin}/payment-failure`
    });

    return NextResponse.json(
      {
        message: 'Session created successfully',
        sessionId: session.id
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error creating checkout session:', err.message);
    return NextResponse.json(
      { message: 'Failed to create checkout session', error: err.message },
      { status: 500 }
    );
  }
}
