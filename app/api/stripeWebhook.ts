// pages/api/stripe.js
import { NextApiRequest, NextApiResponse } from 'next';
import config from "@/env";
import { Stripe } from "stripe";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'] as string,
      config.STRIPE_SECRET_KEY
    );

    if (event.type === 'payment_intent.succeeded') {
      console.log('Payment Intent Succeeded:', event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(`Webhook Error`);
    res.status(400).end();
  }
};

export default webhook