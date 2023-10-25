import { useState, useRef, Dispatch, SetStateAction } from "react";
import { useClickOutside } from "@/lib/hooks";
import Image from "next/image";
import { TokenInfo } from "@/app/meeting/types";

type PriceComponentProps = {
    selectedToken: TokenInfo
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>
    tokenList: TokenInfo[]
    hours: number
}

const TokenSelector = ({ setSelectedToken, selectedToken, tokenList, hours }: PriceComponentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const tokenForm = useRef<HTMLDivElement | null>(null);
    useClickOutside(tokenForm, () => setIsOpen(false));

    const handleItemClick = (token: TokenInfo) => {
        setSelectedToken(token);
        setIsOpen(false);
    };

    return (
        <div ref={tokenForm} className="cursor-pointer w-1/2">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="border-gray-800 border bg-orange-500 hover:bg-orange-400 rounded-md h-12 w-full flex items-center justify-between"
            >
                <span className="text-gray-800 dark:text-gray-100 ml-4">
                    {(selectedToken.price * hours).toFixed(2)}
                </span>
                <div className="ml-4">
                    <Image
                        src={selectedToken.image}
                        alt={selectedToken.symbol} 
                        width={30}
                        height={30}
                    />
                </div>
                <div className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
                        <path d="M3.84 5.44a1 1 0 0 1 1.32 0L8 8.3l2.84-2.86a1 1 0 1 1 1.32 1.5l-3 3a1 1 0 0 1-1.32 0l-3-3a1 1 0 0 1 0-1.5z"/>
                    </svg>
                </div>
            </button>
            {isOpen && (
                <ul className="border-gray-800 border bg-orange-400 absolute rounded-md shadow-md w-32">
                    {tokenList.map((token) => (
                        <li
                            key={token.symbol}
                            className="border-gray-800 flex justify-center space-x-1 rounded-md  hover:bg-orange-300"
                            onClick={() => handleItemClick(token)}
                        >
                            <span className="px-2 py-2 truncate">{token.symbol}</span>
                            <Image
                                src={token.image}
                                alt={token.symbol}
                                width={25}
                                height={25}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TokenSelector;