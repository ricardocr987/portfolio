import { Dispatch, SetStateAction } from "react";
import { DateProps, TokenInfo } from "@/app/meeting/types";
import PaymentComponent from "./PaymentComponent";

type TimeInfo = {
    hour: number
    minute: number
}
type TimeInfoProps = {
    date: DateProps;
    setDate: Dispatch<SetStateAction<DateProps>>;
    availableSlots: string[];
    selectedToken: TokenInfo;
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>;
    tokenList: TokenInfo[];
};

const TimeInfo = ({
    date,
    setDate,
    availableSlots,
    selectedToken,
    setSelectedToken,
    tokenList,
}: TimeInfoProps) => {
    const handleSelectedTime = (slot: string) => {
        if (date.hours.includes(slot)) {
            setDate({ ...date, hours: date.hours.filter((selectedTime) => selectedTime !== slot) });
        } else {
            setDate({ ...date, hours: [...date.hours, slot] });
        }
    };

    return (
        <div className="py-5 w-64">
            {availableSlots.length === 0 ? (
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center w-48 mx-auto block">
                    No available hour slots
                </h2>
            ) : !date.day ? (
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center w-48 mx-auto block">
                        Select day to check available hours
                    </h2>
            ) : (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Available Time
                    </h2>
                    <ul className="mt-2 space-y-2 text-center w-full">
                        {availableSlots.map((slot, index) => (
                            <li
                                key={`hour-${index}`}
                                className={`rounded-lg py-1 cursor-pointer border-gray-800 border text-gray-800 dark:text-gray-100 ${
                                    date.hours.includes(slot)
                                        ? 'bg-blue-500'
                                        : 'bg-green-500'
                                }`}
                                onClick={() => handleSelectedTime(slot)}
                            >
                                {date.hours.includes(slot)
                                    ? `Selected ${slot}`
                                    : `Select ${slot}`
                                }
                            </li>
                        ))}
                    </ul>
                    <PaymentComponent 
                        setSelectedToken={setSelectedToken} 
                        selectedToken={selectedToken}
                        tokenList={tokenList}
                        hours={date.hours.length}
                    />
                </div>
            )}
        </div>
    );
};

export default TimeInfo;
