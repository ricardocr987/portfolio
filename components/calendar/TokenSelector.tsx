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
        <div 
            ref={tokenForm} 
            className="cursor-pointer border-gray-800 border bg-orange-500 hover:bg-orange-400 rounded-md w-full"
        >
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                className="h-12 px-2 flex items-center justify-between"
            >
                <span className="text-gray-800 dark:text-gray-100 px-2">
                    {(selectedToken.price * hours).toFixed(2)}
                </span>
                <Image
                    src={selectedToken.image}
                    alt={selectedToken.symbol} 
                    width={28}
                    height={28}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
                    <path d="M3.84 5.44a1 1 0 0 1 1.32 0L8 8.3l2.84-2.86a1 1 0 1 1 1.32 1.5l-3 3a1 1 0 0 1-1.32 0l-3-3a1 1 0 0 1 0-1.5z"/>
                </svg>
            </div>
            {isOpen && (
                <ul className="border-gray-800 border bg-orange-400 absolute rounded-md shadow-md">
                    {tokenList.map((token) => (
                        <li
                            key={token.symbol}
                            className="border-gray-800 flex flex-col justify-center rounded-md hover:bg-orange-300"
                            onClick={() => handleItemClick(token)}
                        >
                            <div className="grid grid-cols-2 gap-2 items-center justify-center text-center py-1">
                                <span className="px-2">{token.symbol}</span>
                                <Image
                                    className="ml-2"
                                    src={token.image}
                                    alt={token.symbol}
                                    width={28}
                                    height={28}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TokenSelector;