import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bs58 from "bs58";
import { decryptData } from "@/lib/encrypt";
import { DateProps } from "@/app/meeting/types";
import { formatDateProps, generateMeet } from "@/lib/meet";

//const requestBodySchema = z.array(BodyRequest);

export async function POST(req: NextRequest) {
    /*const authorization = req.headers.get('Authorization');
    if (authorization !== `Bearer ${config.SOLANA_WEBHOOK_AUTH}`) {
        console.log('Unauthorized request');
        return new Response('Unauthorized request', { status: 401 });
    }*/
    const requestBody = await req.json() as RequestBody;
    console.log('Received request body:', JSON.stringify(requestBody, null, 2));

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

type RequestBody = {
    timestamp: string;
    fee: number;
    fee_payer: string;
    signers: string[];
    signatures: string[];
    protocol: {
      address: string;
      name: string;
    };
    type: string;
    status: string;
    actions: Array<{
      info: any;
      source_protocol: any;
      type: string;
    }>;
    events: string[];
    raw: {
      blockTime: number;
      meta: {
        computeUnitsConsumed: number;
        err: any;
        fee: number;
        innerInstructions: any[];
        logMessages: string[];
        postBalances: number[];
        postTokenBalances: any[];
        preBalances: number[];
        preTokenBalances: any[];
        rewards: string[];
        status: any;
      };
      slot: number;
      transaction: {
        message: any;
        signatures: string[];
      };
      version: number;
    };
    accounts: Array<{
      address: string;
      owner: string;
      lamports: number;
      data: string;
    }>;
  };
  
  export default RequestBody;
  