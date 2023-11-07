import { Dispatch, SetStateAction, useState } from "react"
import { DateProps, TokenInfo } from "@/app/meeting/types"
import CryptoPayment from "./CryptoPayment"
import { checkout } from "@/app/meeting/actions";
import toast from "react-hot-toast";

type PriceComponentProps = {
    selectedToken: TokenInfo
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>
    tokenList: TokenInfo[]
    date: DateProps
    customerEmail: string
    message: string
}

const PaymentComponent = ({ setSelectedToken, selectedToken, tokenList, date, customerEmail, message }: PriceComponentProps) => {
    const [paymentMode, setPaymentMode] = useState('');

    const handleCardPayment = async () => {
        if (date.hours.length === 0) {
            toast.error('You should select an hour at least');
            return;
        } 
        if (customerEmail === '') {
            toast.error('You should introduce an email');
            return;
        } else {
            try {
                const checkoutPage = await checkout(date, customerEmail, message);
                window.location.href = checkoutPage;
            } catch (error) {
                console.log(error);
            }
        }
    };

    const showSolana = () => {
        if (date.hours.length === 0) {
            toast.error('You should select an hour at least');
        } else {
            setPaymentMode('solana')
        }
    };

    const InitialState = (
        <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Payment options:</h2>
            <div className="flex items-center">
                <button
                    className="border-gray-800 border bg-orange-500 hover:bg-orange-400 rounded-md text-center cursor-pointer h-12 w-1/2"
                    onClick={handleCardPayment}
                >
                    Card
                </button>
                <button
                    className="border-gray-800 border bg-orange-500 hover:bg-orange-400 rounded-md text-center cursor-pointer h-12 w-1/2"
                    onClick={showSolana}
                >
                    Solana
                </button>
            </div>
        </div>
    );
    
    return (
        <div className="flex flex-col mb-20 mt-4">
            {paymentMode === 'solana' && (
                <CryptoPayment
                    setSelectedToken={setSelectedToken}
                    selectedToken={selectedToken}
                    tokenList={tokenList}
                    setPaymentMode={setPaymentMode}
                    date={date}
                    customerEmail={customerEmail}
                    message={message}
                />
            )}
            {paymentMode === '' && InitialState}
        </div>
    );
}

export default PaymentComponent;