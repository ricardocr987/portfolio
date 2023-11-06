'use server'

import config from "@/lib/env";
import { Stripe } from "stripe";
import { DateProps } from "./types";
import { v4 as uuid } from 'uuid';

export const checkout = async (date: DateProps, customerEmail: string, message: string) => {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const sessionId = uuid();
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail,
        customer_creation: "always",
        line_items: [
            {
                price: config.PRICE_ID,
                quantity: date.hours.length,
            },
        ],
        success_url: `${config.APP_URL}/booked?session_id=${sessionId}`,        
        cancel_url: `${config.APP_URL}/meeting`,
        metadata: {
            sessionId,
            message,
            date: JSON.stringify(date)
        }
    });

    if (session.url) {
        return session.url;
    } else {
        throw new Error("Session URL not available.");
    }
}