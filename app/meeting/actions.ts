'use server'

import config from "@/env";
import { Stripe } from "stripe";

export const checkout = async (quantity: number) => {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price: config.PRICE_ID,
                quantity,
            },
        ],
        success_url: `${config.APP_URL}/success`,
        cancel_url: `${config.APP_URL}/meeting`,
    });

    if (session.url) {
        return session.url;
    } else {
        throw new Error("Session URL not available.");
    }
}