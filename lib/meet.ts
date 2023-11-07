import { DateProps } from "@/app/meeting/types";
import MeetingPurchase from "./email/meeting-purchase";
import getAccessToken from "./getAccessToken";
import React from "react";
import { Resend } from "resend";
import config from "./env";

const resend = new Resend(config.RESEND_API_KEY);

export async function generateMeet(
    meetingTime: { start: string, end: string }, 
    customerEmail: string, 
    sessionId: string, 
    message: string
) {
    try {
        const participants = ['ricardocr987@gmail.com', customerEmail];
        const body = {
            summary: message,
            requestId: sessionId,
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
            entryPoints: [
                {
                    entryPointType: "video",
                    uri: "https://meet.google.com/",
                    label: "meet.google.com"
                }
            ],
            createRequest: {requestId: sessionId},
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
        const meetLink = details.hangoutLink;
        const htmlLink = details.htmlLink;
        if (meetLink && htmlLink) {
            const formattedStartTime = new Date(meetingTime.start).toLocaleString();
            const formattedEndTime = new Date(meetingTime.end).toLocaleString();
            const messageIntro = `Hello,<br><br>You have successfully purchased a meeting with me.<br><br>`;
            const meetingDetails = `
                <strong>Meeting Start Time:</strong> ${formattedStartTime}<br>
                <strong>Meeting End Time:</strong> ${formattedEndTime}<br>
                <strong>Meeting Link:</strong> <a href="${meetLink}">${meetLink}</a><br>
                <strong>Google Calendar Event Link:</strong> <a href="${details.htmlLink}">${details.htmlLink}</a><br><br>`;
            const messageOutro = `Accept the calendar event or click the link above at the scheduled time to join the meeting.`;
            
            const meetMessage = `<p style="font-size: 16px; line-height: 1.5;">
                ${messageIntro}${meetingDetails}${messageOutro}
            </p>`;
            
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
  
export function formatDateProps(dateProps: DateProps): { start: string; end: string } {
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