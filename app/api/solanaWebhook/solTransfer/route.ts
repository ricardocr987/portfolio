import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { solTransferSchema } from "./schema";
import bs58 from "bs58";
import { decryptData } from "@/lib/encrypt";
import { DateProps } from "@/app/meeting/types";
import { formatDateProps, generateMeet } from "@/lib/meet";

export async function POST(req: NextRequest) {
    /*const authorization = req.headers.get('Authorization');
    if (authorization !== `Bearer ${config.SOLANA_WEBHOOK_AUTH}`) {
        console.log('Unauthorized request');
        return new Response('Unauthorized request', { status: 401 });
    }*/
    const requestBody = solTransferSchema.parse(req.body);
    console.log('Received request body:', requestBody);
    console.log(requestBody.actions.map(x => x.info))
    /*const asyncTasks = requestBody.map(async (rawTxn) => {
        try {
            const { transaction } = rawTxn;
            const instructionData = transaction.message.instructions[1].data;
            const bufferData = Buffer.from(bs58.decode(instructionData));
            const data = decryptData(bufferData.toString());
            const { date, customerEmail, sessionId, message } = JSON.parse(data);
            const dateProps: DateProps = date;
            const meetingTime = formatDateProps(dateProps);

            try {
                await generateMeet(meetingTime, customerEmail, sessionId, message);
                console.log('Generated meeting:', meetingTime);
            } catch (error) {
                console.error('Webhook Error:', error);
                return NextResponse.json(JSON.stringify({ error }));
            }
          
            return NextResponse.json(JSON.stringify({ received: true }));
        } catch (error) {
            console.error('Webhook Error:', error);
            return NextResponse.json(JSON.stringify({ error: 'Stripe error' }));
        }
    });

    const results = await Promise.all(asyncTasks);
    const transactionIds = results.map((result) => result).join(", ");
    console.log('Transaction IDs:', transactionIds);*/
    return new Response(`IDs: null added.`, { status: 200 });
}