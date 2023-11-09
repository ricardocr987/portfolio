import { SendOptions, VersionedTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
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

interface StatusPromise extends Promise<any> {
    subscriptionId?: number;
}

const CryptoComponent = ({
    selectedToken,
    setSelectedToken,
    tokenList,
    setPaymentMode,
    date, 
    customerEmail, 
    message
}: CryptoComponentProps) => {
    const { wallets, select, connect, sendTransaction, publicKey } = useWallet();

    const connectWallet = async () => {
        select(wallets[0].adapter.name);
        connect();
    }

    const awaitConfirmation = async (signature: string): Promise<StatusPromise> => {
        const statusPromise: StatusPromise = new Promise(async (resolve, reject) => {
            config.SOL_CONNECTION.onSignature(signature, async (result) => {
                console.log('Result', result);

                if (result.err) {
                    console.error('Error confirming transaction:', result.err);
                    reject(result.err);
                } else {
                    const confirmationStatus = result?.err ? null : true;

                    if (confirmationStatus) {
                        console.log('Transaction confirmed:', signature);
                        resolve(result);
                    }
                }
            }, 'confirmed');
        });

        console.log('Subscribed for status updates. Waiting for confirmation or expiry...');
            
        // Use Promise.race to wait for either the confirmation or expiry signal
        const raceResult = await Promise.race([
            statusPromise,
            new Promise(resolve => {
                setTimeout(() => {
                    console.log('Timeout reached. No confirmation received. Rejecting the promise.');
                    resolve('expiry'); // Resolve with a specific value for the timeout
                }, 10000);
            }),
        ]);
        
        console.log('Race result:', raceResult);
        
        if (raceResult === 'expiry') {
            console.log('Expiry signal received during race. Stopping the confirmation process.');
        } else if (statusPromise.subscriptionId) {
            config.SOL_CONNECTION.removeSignatureListener(statusPromise.subscriptionId);
            console.log('Transaction confirmed during race. Continuing with the original confirmation logic.');
        } else {
            console.error('Error: subscriptionId is undefined.');
        }
    };

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
            const sendOptions: SendOptions = {
                skipPreflight: false,
                preflightCommitment: 'confirmed',
                maxRetries: 5,
                minContextSlot: 0,
            };
            const sig = await sendTransaction(transaction, config.SOL_CONNECTION, sendOptions);
            const blockhash = await config.SOL_CONNECTION.getLatestBlockhash('finalized');
            await config.SOL_CONNECTION.confirmTransaction(
                {
                    blockhash: blockhash.blockhash,
                    lastValidBlockHeight: blockhash.lastValidBlockHeight,
                    signature: sig,
                },
                'confirmed'
            );

            toast.success('Payment done. You should have received an email.');
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