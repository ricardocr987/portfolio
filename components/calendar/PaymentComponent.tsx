import { Dispatch, SetStateAction } from "react"
import TokenSelector from "./TokenSelector"
import { TokenInfo } from "@/app/meeting/types"

type PriceComponentProps = {
    selectedToken: TokenInfo
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>
    tokenList: TokenInfo[]
    hours: number
}

const PaymentComponent = ({ setSelectedToken, selectedToken, tokenList, hours }: PriceComponentProps) => {
    return (
        <div className="flex justify-center py-2 ">
            <div className="flex w-48 h-14 py-2">
                <TokenSelector
                    setSelectedToken={setSelectedToken} 
                    selectedToken={selectedToken}
                    tokenList={tokenList}
                    hours={hours}
                />
                <button 
                    className="border-gray-800 border bg-gray-500 rounded-md text-center py-2 cursor-pointer h-12 w-24"
                >
                    Pay
                </button>
            </div>
        </div>
    );
}

export default PaymentComponent;