import config from "@/lib/env";
import { Stripe } from "stripe";
import { DateProps } from "@/app/meeting/types";
import { NextResponse } from "next/server";
import getAccessToken from "@/lib/getAccessToken";
import { Resend } from "resend";
import React from "react";
import MeetingPurchase from "@/lib/email/meeting-purchase";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const resend = new Resend(config.RESEND_API_KEY);

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
    // to-do: optimize to not receive non-completed requests
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

async function generateMeet(
  meetingTime: { start: string, end: string }, 
  customerEmail: string, 
  sessionId: string, 
  message: string
) {
  try {
    console.log('hola')
    const participants = ['ricardocr987@gmail.com', customerEmail];
    const body = {
      summary: message,
      description: 'Google Meet Link',
      start: {
        dateTime: meetingTime.start,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: meetingTime.end,
        timeZone: 'Europe/Madrid',
      },
      conferenceData: {
        coferenceId: sessionId,
        entryPoints: [
          {
            entryPointType: "video",
            uri: `https://meet.google.com/${sessionId}`,
            label: `meet.google.com/${sessionId}`
          }
        ],
        conferenceSolution: {
          key: {
            type: "hangoutsMeet"
          }
        }
      },
      attendees: participants.map((email) => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', 'minutes': 24 * 60 },
          { method: 'popup', 'minutes': 10 },
        ],
      },
    };

    const apiUrl = new URL(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    );
  
    apiUrl.searchParams.set("sendNotifications", "true");
    apiUrl.searchParams.set("conferenceDataVersion", "1");
  
    const response = await fetch(apiUrl, {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(body),
    });
    const details = await response.json();
    console.log(details)
    const meetLink = details.hangoutLink;
    console.log('Generated Meet Link:', meetLink);
    if (meetLink) {
      const meetMessage = `Hello,\n\nYou have successfully purchased a meeting with me. The meeting details are as follows:\n\nMeeting Date & Time: ${meetingTime}\nMeeting Link: ${meetLink}\n\nPlease click the link above at the scheduled time to join the meeting.`;
      await sendMeetingEmail(customerEmail, meetMessage);
      await sendMeetingEmail('ricardocr987@gmail.com', meetMessage);
    } else {
      throw new Error('Webhook Error: Failed to generate Meet Link');
    }

    return details.hangoutLink
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
  }
}

async function sendMeetingEmail(recipientEmail: string, message: string) {
  await resend.emails.send({
    from: "Contact Form <contact@riki.bio>",
    to: recipientEmail,
    subject: "Meeting with Ricardo",
    react: React.createElement(MeetingPurchase, {
      message,
    }),
  });
}

function formatDateProps(dateProps: DateProps): { start: string; end: string } {
  if (!dateProps.year || !dateProps.month || !dateProps.hours.length) {
    throw new Error('Invalid DateProps');
  }

  const day = dateProps.day || 1;
  const formattedDate = `${dateProps.year}-${String(dateProps.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const startTime = dateProps.hours[0];
  const endTime = dateProps.hours[dateProps.hours.length - 1];

  const startTimeParts = startTime.split(':');
  const endTimeParts = endTime.split(':');

  let startHour = parseInt(startTimeParts[0], 10);
  let startMinute = parseInt(startTimeParts[1], 10);

  let endHour = parseInt(endTimeParts[0], 10);
  let endMinute = parseInt(endTimeParts[1], 10);

  endMinute += 15;
  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }

  const end = `${formattedDate}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
  const start = `${formattedDate}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;

  return { start, end };
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