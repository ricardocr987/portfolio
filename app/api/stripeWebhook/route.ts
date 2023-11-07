import config from "@/lib/env";
import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { DateProps } from "@/app/meeting/types";
import { formatDateProps, generateMeet } from "@/lib/meet";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('Webhook Error: No signature');
      return NextResponse.json(JSON.stringify({ error: 'No signature' }));
    }
    
    const requestBody = await req.text();
    if (!requestBody) {
      console.error('Webhook Error: Invalid request body');
      return NextResponse.json(JSON.stringify({ error: 'Invalid request body' }));
    }
    
    const event = stripe.webhooks.constructEvent(
      requestBody,
      signature,
      config.STRIPE_WEBHOOK_SECRET_KEY
    );

    const eventData = event.data.object as CheckoutSession;
    // to-do: optimize to not receive non-completed requests (only receive confirmed ones)
    if (eventData.status !== 'complete') {
      return NextResponse.json(JSON.stringify({ error: 'Invalid request body' }));
    }

    const message = eventData.metadata.message;
    const sessionId = eventData.metadata.sessionId;
    const customerEmail = eventData.customer_email;
    const dateProps = JSON.parse(eventData.metadata.date) as DateProps;
    const meetingTime = formatDateProps(dateProps);

    try {
      await generateMeet(meetingTime, customerEmail, sessionId, message);
    } catch (error) {
      console.error('Webhook Error:', error);
      return NextResponse.json(JSON.stringify({ error }));
    }

    return NextResponse.json(JSON.stringify({ received: true }));
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(JSON.stringify({ error: 'Stripe error' }));
  }
}



type CheckoutSession = {
  id: string;
  object: string;
  after_expiration: null;
  allow_promotion_codes: null;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: {
    enabled: boolean;
    status: string | null;
  };
  billing_address_collection: null;
  cancel_url: string;
  client_reference_id: null;
  client_secret: null;
  consent: null;
  consent_collection: null;
  created: number;
  currency: string;
  currency_conversion: null;
  custom_fields: any[]; // You can specify a more specific type for custom_fields
  custom_text: {
    shipping_address: null;
    submit: null;
    terms_of_service_acceptance: null;
  };
  customer: string;
  customer_creation: string;
  customer_details: {
    address: {
      city: null;
      country: string;
      line1: null;
      line2: null;
      postal_code: null;
      state: null;
    };
    email: string;
    name: string;
    phone: null;
    tax_exempt: string;
    tax_ids: any[]; // You can specify a more specific type for tax_ids
  };
  customer_email: string;
  expires_at: number;
  invoice: null;
  invoice_creation: {
    enabled: boolean;
    invoice_data: {
      account_tax_ids: null;
      custom_fields: null;
      description: null;
      footer: null;
      metadata: any; // You can specify a more specific type for metadata
      rendering_options: null;
    };
  };
  livemode: boolean;
  locale: null;
  metadata: {
    message: string;
    date: string;
    sessionId: string;
  };
  mode: string;
  payment_intent: string;
  payment_link: null;
  payment_method_collection: string;
  payment_method_configuration_details: null;
  payment_method_options: Record<string, any>; // You can specify a more specific type
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: {
    enabled: boolean;
  };
  recovered_from: null;
  setup_intent: null;
  shipping_address_collection: null;
  shipping_cost: null;
  shipping_details: null;
  shipping_options: any[]; // You can specify a more specific type for shipping_options
  status: string;
  submit_type: null;
  subscription: null;
  success_url: string;
  total_details: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  ui_mode: string;
  url: null;
};