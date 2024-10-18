import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success`,
      cancel_url: `${req.headers.origin}/payment-failure`
    });

    NextResponse.json(
      {
        message: 'Session created successfully'
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
