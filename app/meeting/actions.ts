'use server'

import config from "@/lib/env";
import { Stripe } from "stripe";
import { DateProps } from "./types";

export const checkout = async (date: DateProps, customerEmail: string, message: string) => {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const sessionId = generateHangoutsMeetID();
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

function generateHangoutsMeetID() {
    const characters = 'abcdefghijklmnopqrstuvwxyz'; // Define the set of characters to choose from
    const randomChar = () => characters[Math.floor(Math.random() * characters.length)];
  
    // Generate a 10-letter meeting code
    const firstGroup = Array.from({ length: 3 }, randomChar).join('');
    const secondGroup = Array.from({ length: 4 }, randomChar).join('');
    const thirdGroup = Array.from({ length: 3 }, randomChar).join('');
  
    // Format the meeting code as aaa-bbbb-ccc
    return `${firstGroup}-${secondGroup}-${thirdGroup}`;
  }