import toast from "react-hot-toast";
import TokenSelector from "./TokenSelector";
import { TokenInfo } from "@/app/meeting/types";
import { Dispatch, SetStateAction } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import config from "@/env";
import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { RIKI_PUBKEY, decimalsFromPubkey, mintFromSymbol } from "@/constants";

type CryptoComponentProps = {
    selectedToken: TokenInfo;
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>;
    tokenList: TokenInfo[];
    hours: number;
    setPaymentMode: Dispatch<SetStateAction<string>>;
};

const CryptoComponent = ({
    selectedToken,
    setSelectedToken,
    tokenList,
    hours,
    setPaymentMode
}: CryptoComponentProps) => {
    const { pending } = useFormStatus();
    const { wallets, select, connect, sendTransaction, publicKey } = useWallet();

    const handlePayment = async () => {
        if (hours === 0) {
            toast.error('You should select an hour at least');
            return;
        } else {
            try {
                if (!publicKey) {
                    select(wallets[0].adapter.name);
                    connect();
                } else {
                    if (selectedToken.symbol === 'SOL') {
                        const transferAccounts = {
                            fromPubkey: publicKey,
                            toPubkey: RIKI_PUBKEY,
                            lamports: tokenList[1].price * hours * 10 ** decimalsFromPubkey['SOL'],
                        }
                        const ix = SystemProgram.transfer(transferAccounts);
                        let blockhash = (await config.SOL_CONNECTION.getLatestBlockhash('finalized')).blockhash
                        const messageV0 = new TransactionMessage({
                            payerKey: publicKey,
                            recentBlockhash: blockhash,
                            instructions: [ix],
                        }).compileToV0Message();
                        const tx = new VersionedTransaction(messageV0);
                        await sendTransaction(tx, config.SOL_CONNECTION);
                    } else if (selectedToken.symbol === 'USDC') {
                        const source = getAssociatedTokenAddressSync(new PublicKey(mintFromSymbol['USDC']), publicKey);
                        const destination = getAssociatedTokenAddressSync(new PublicKey(mintFromSymbol['USDC']), RIKI_PUBKEY);
                        const amount = tokenList[0].price * hours * 10 ** decimalsFromPubkey['USDC'];
                        const usdcIx = createTransferInstruction(source, destination, publicKey, amount);
                        let blockhash = (await config.SOL_CONNECTION.getLatestBlockhash('finalized')).blockhash;
                        const messageV0 = new TransactionMessage({
                            payerKey: publicKey,
                            recentBlockhash: blockhash,
                            instructions: [usdcIx],
                        }).compileToV0Message();
                        const tx = new VersionedTransaction(messageV0);
                        await sendTransaction(tx, config.SOL_CONNECTION);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    return (
        <>
            <button 
                className="text-lg font-semibold border-gray-800 border bg-orange-500 hover:bg-orange-400 mt-2"
                onClick={() => setPaymentMode('')}
            >
                Back
            </button>
            <div className="flex justify-center w-full">
                <div className="flex h-14 w-full">
                    <TokenSelector
                        setSelectedToken={setSelectedToken} 
                        selectedToken={selectedToken}
                        tokenList={tokenList}
                        hours={hours}
                    />
                    <button
                        type="submit"
                        className="border-gray-800 border bg-orange-500 hover:bg-orange-400 rounded-md text-center py-2 cursor-pointer h-12 w-1/2"
                        onClick={handlePayment}
                        disabled={pending}
                    >
                        Pay
                    </button>
                </div>
            </div>
        </>
    )
}

export default CryptoComponent;
