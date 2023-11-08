import { NextRequest, NextResponse } from "next/server";
import { decryptData } from "@/lib/encrypt";
import { DateProps } from "@/app/meeting/types";
import { formatDateProps, generateMeet } from "@/lib/meet";
import { RIKI_PUBKEY } from "@/lib/constants";
import config from "@/lib/env";

export async function POST(req: NextRequest) {
    try {
        const authorization = req.headers.get('x-api-key');
        console.log(authorization, config.SOLANA_WEBHOOK_AUTH)
        if (authorization === config.SOLANA_WEBHOOK_AUTH) {
            throw new Error('Invalid callback request');
        }
        /*if (authorization !== `Bearer ${config.SOLANA_WEBHOOK_AUTH}`) {
            console.log('Unauthorized request');
            return new Response('Unauthorized request', { status: 401 });
        }*/
        const requestBody = await req.json() as RequestBody;
        console.log('Received request body:', JSON.stringify(requestBody, null, 2));

        const solTransferAction = requestBody.actions.find((action) => action.type === "SOL_TRANSFER");
        const usdcTransferAction = requestBody.actions.find((action) => action.type === "TOKEN_TRANSFER");

        if (!(isSolTransfer(solTransferAction) || isUsdcTransfer(usdcTransferAction))) {
            throw new Error('Invalid transaction actions');
        }

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
        return NextResponse.json(JSON.stringify({ error }));
    }
}

function isSolTransfer(action: Action | undefined): boolean {
    return (
        action &&
        action.type === "SOL_TRANSFER" &&
        action.info &&
        action.info.receiver === RIKI_PUBKEY.toString()
    );
}
  
function isUsdcTransfer(action: Action | undefined): boolean {
    return (
        action &&
        action.type === "TOKEN_TRANSFER" &&
        action.info &&
        action.info.receiver === RIKI_PUBKEY.toString()
    );
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