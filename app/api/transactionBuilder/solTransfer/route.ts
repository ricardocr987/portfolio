import { TransactionInstruction, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { decimalsFromSymbol, RIKI_PUBKEY } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from 'uuid'
import config from "@/lib/env";
import { encryptData } from "@/lib/encrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pubkey, date, customerEmail, message, price } = body;
        const memoIx = new TransactionInstruction({
            keys: [{ pubkey: new PublicKey(pubkey), isSigner: true, isWritable: true }],
            data: encryptData(JSON.stringify({ date, customerEmail, sessionId: uuid(), message })),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        });

        const transferAmount = price * 10 ** decimalsFromSymbol['SOL'];
        const transferAccounts = {
            fromPubkey: new PublicKey(pubkey),
            toPubkey: RIKI_PUBKEY,
            lamports: transferAmount,
        };
        const transferIx = SystemProgram.transfer(transferAccounts);

        const blockhash = (await config.SOL_CONNECTION.getLatestBlockhash('finalized')).blockhash;
        const messageV0 = new TransactionMessage({
            payerKey: new PublicKey(pubkey),
            recentBlockhash: blockhash,
            instructions: [transferIx, memoIx],
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        const serializedTransaction = Buffer.from(transaction.serialize()).toString('base64');

        return NextResponse.json({ transaction: serializedTransaction });
    } catch (error) {
        console.error(error);

        return NextResponse.json({
            error: "An error occurred while processing the request.",
        });
    }
}
