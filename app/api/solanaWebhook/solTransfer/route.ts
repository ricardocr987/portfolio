import { NextRequest, NextResponse } from "next/server";
import { decryptData } from "@/lib/encrypt";
import { DateProps } from "@/app/meeting/types";
import { formatDateProps, generateMeet } from "@/lib/meet";

export async function POST(req: NextRequest) {
    try {
        /*const authorization = req.headers.get('Authorization');
        if (authorization !== `Bearer ${config.SOLANA_WEBHOOK_AUTH}`) {
            console.log('Unauthorized request');
            return new Response('Unauthorized request', { status: 401 });
        }*/
        const requestBody = await req.json() as RequestBody;
        /*const transactionBlockTime = requestBody.raw.blockTime;
        const currentSlot = await config.SOL_CONNECTION.getSlot(confirmOptions);
        const currentBlockTime = await config.SOL_CONNECTION.getBlockTime(currentSlot);*/
        console.log('Received request body:', JSON.stringify(requestBody, null, 2));

        const solTransferAction = requestBody.actions.find((action) => action.type === "SOL_TRANSFER");
        console.log('solTransferAction', solTransferAction);

        const memoAction = requestBody.actions.find((action) => action.type === "MEMO");
        const data = decryptData(memoAction?.info.message);
        const { date, customerEmail, sessionId, message } = JSON.parse(data);
        const dateProps: DateProps = date;
        const meetingTime = formatDateProps(dateProps);

        await generateMeet(meetingTime, customerEmail, sessionId, message);
        console.log('Generated meeting:', meetingTime);
        
        return NextResponse.json(JSON.stringify({ received: true }));
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json(JSON.stringify({ error: 'Stripe error' }));
    }
}

type Action = {
    info: any;
    source_protocol: {
        address: string;
        name: string;
    };
    type: string;
};
  
type Meta = {
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
  
type Message = {
    accountKeys: Array<{
        pubkey: string;
        signer: boolean;
        source: string;
        writable: boolean;
    }>;
};
  
type RawData = {
    blockTime: number;
    meta: Meta;
    slot: number;
    transaction: {
        message: Message;
        signatures: string[];
    };
    version: number;
};
  
type Account = {
    address: string;
    owner: string;
    lamports: number;
    data: string;
};
  
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
    actions: Action[];
    events: string[];
    raw: RawData;
    accounts: Account[];
};  