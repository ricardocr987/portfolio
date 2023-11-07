import { VersionedTransaction } from "@solana/web3.js";
import { decimalsFromSymbol } from "@/lib/constants";
import { DateProps, TokenInfo } from "@/app/meeting/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { Dispatch, SetStateAction } from "react";
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
    const { wallets, select, connect, sendTransaction, publicKey } = useWallet();

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
                USDC: `${config.APP_URL}/api/transactionBuilder/usdcTransfer`,
                SOL: `${config.APP_URL}/api/transactionBuilder/solTransfer`,
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
                throw new Error(`API request failed with status: ${response.status}`);
            }
        
            const serializedBase64 = await response.json();
            const serializedBuffer = Buffer.from(serializedBase64.transaction, 'base64');
            const transaction = VersionedTransaction.deserialize(serializedBuffer);
            await sendTransaction(transaction, config.SOL_CONNECTION);
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
                        className="cursor-pointer border-gray-800 border bg-orange-500 hover:bg-orange-400 rounded-md w-full"
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
