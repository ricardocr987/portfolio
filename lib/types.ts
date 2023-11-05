import { links } from "./data";

export type SectionName = (typeof links)[number]["name"];

/**
* Represents a meeting request that is sent to the owner.
*/
export type AppointmentProps = {
 /** Starting time string (in ISO format) */
 start: string
 /** Ending time string (in ISO format) */
 end: string
 /** Meeting title */
 summary: string
 /** Email address of the requester. */
 email: string
 /** Location of the meeting. */
 location: string
 /** Timezone of the requester. */
 timeZone: string
 /** A unique ID for generating Google Meet details */
 requestId: string
 /** Name of the requester */
 name: string
 /** Duration of the meeting in minutes  */
 duration: string
}

