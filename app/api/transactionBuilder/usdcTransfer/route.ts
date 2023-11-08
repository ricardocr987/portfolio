import { TransactionInstruction, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { decimalsFromSymbol, mintFromSymbol, RIKI_PUBKEY } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from 'uuid'
import config from "@/lib/env";
import { encryptData } from "@/lib/encrypt";
import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pubkey, date, customerEmail, message, price } = body;
        const memoIx = new TransactionInstruction({
            keys: [{ pubkey: new PublicKey(pubkey), isSigner: true, isWritable: true }],
            data: Buffer.from(encryptData(JSON.stringify({ date, customerEmail, sessionId: uuid(), message }))),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        });
        const usdcMint = new PublicKey(mintFromSymbol['USDC']);
        const source = getAssociatedTokenAddressSync(new PublicKey(usdcMint), new PublicKey(pubkey));
        const destination = getAssociatedTokenAddressSync(new PublicKey(usdcMint), RIKI_PUBKEY);
        const amount = price * 10 ** decimalsFromSymbol['USDC'];

        const usdcIx = createTransferInstruction(source, destination, new PublicKey(pubkey), amount);

        const blockhash = (await config.SOL_CONNECTION.getLatestBlockhash('finalized')).blockhash;
        const messageV0 = new TransactionMessage({
            payerKey: new PublicKey(pubkey),
            recentBlockhash: blockhash,
            instructions: [usdcIx, memoIx],
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