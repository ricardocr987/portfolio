import { VersionedTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { DateProps, TokenInfo } from "@/app/meeting/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import TokenSelector from "./TokenSelector";
import toast from "react-hot-toast";
import config from "@/lib/env";

type CryptoComponentProps = {
    selectedToken: TokenInfo;
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>;
    tokenList: TokenInfo[];
    setPaymentMode: Dispatch<SetStateAction<string>>;
    date: DateProps
    customerEmail: string
    message: string
};

const CryptoComponent = ({
    selectedToken,
    setSelectedToken,
    tokenList,
    setPaymentMode,
    date, 
    customerEmail, 
    message
}: CryptoComponentProps) => {
    const { wallets, select, connect, sendTransaction, publicKey, signTransaction } = useWallet();

    const connectWallet = async () => {
        select(wallets[0].adapter.name);
        connect();
    }

    const handlePayment = async () => {
        if (date.hours.length === 0) {
            toast.error('You should select at least one hour.');
            return;
        }

        try {
            if (!publicKey) {
                return;
            }
        
            const selectedTokenSymbol = selectedToken.symbol;
            const apiEndpoints: Record<string, string> = {
                USDC: `https://www.riki.bio/api/transactionBuilder/usdcTransfer`,
                SOL: `https://www.riki.bio/api/transactionBuilder/solTransfer`,
            };
            const apiEndpoint = apiEndpoints[selectedTokenSymbol];
        
            if (!apiEndpoint) {
                return;
            }
            const tokenPrices: Record<string, number> = {
                USDC: tokenList[0].price,
                SOL: tokenList[1].price,
            };
            
            const price = tokenPrices[selectedToken.symbol] * date.hours.length || 0;
            const requestData = {
                pubkey: publicKey,
                date,
                customerEmail,
                message,
                price,
            };
        
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            };
        
            const response = await fetch(apiEndpoint, requestOptions);
            
            if (!response.ok) {
                console.log(response)
                throw new Error(`API request failed with status: ${response.status}`);
            }
        
            const serializedBase64 = await response.json();
            const serializedBuffer = Buffer.from(serializedBase64.transaction, 'base64');
            const transaction = VersionedTransaction.deserialize(serializedBuffer);
            const signature = await sendTransaction(transaction, config.SOL_CONNECTION);
            console.log(signature)
            
            // Check signature status
            //const signatureStatuses = await config.NO_COMMITMENT_SOL_CONNECTION.getSignatureStatuses([signature]);
            //const isSignatureConfirmed = signatureStatuses.value[0]?.confirmationStatus === 'confirmed';

            const latestBlockhash = await config.SOL_CONNECTION.getLatestBlockhash('confirmed');
            // Check if the transaction is confirmed using confirmTransaction
            const result = await config.SOL_CONNECTION.confirmTransaction({
                ...latestBlockhash,
                signature,
            }, 'confirmed');
            console.log(result)

            toast.success('Payment confirmed. You should have received a mail.');
        } catch (error) {
            console.error('An error occurred:', error);
            toast.error('Payment failed. Please try again later.');
        }
    };

    return (
        <div>
            <button 
                className="text-md font-semibold border-gray-800 border bg-orange-500 hover:bg-orange-400 w-full rounded-md"
                onClick={() => setPaymentMode('')}
            >
                Back
            </button>
            <div className="flex justify-center">
                <TokenSelector
                    setSelectedToken={setSelectedToken} 
                    selectedToken={selectedToken}
                    tokenList={tokenList}
                    hours={date.hours.length}
                />
                {publicKey ? 
                        <button
                            type="submit"
                            className="cursor-pointer border-gray-800 border bg-orange-500 hover-bg-orange-400 rounded-md w-full"
                            onClick={handlePayment}
                        >
                            Pay
                        </button>
                :
                    <button
                        type="submit"
                        className="cursor-pointer border-gray-800 border bg-orange-500 hover:bg-orange-400 rounded-md w-full"
                        onClick={connectWallet}
                    >
                        Connect Wallet
                    </button>
                }
            </div>
        </div>
    );
};

export default CryptoComponent;

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};