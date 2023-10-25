import { Dispatch, SetStateAction } from "react";
import { DateProps, TokenInfo } from "@/app/meeting/types";
import PaymentComponent from "./PaymentComponent";

type TimeInfoProps = {
    date: DateProps;
    setDate: Dispatch<SetStateAction<DateProps>>;
    availableHours: number[];
    selectedToken: TokenInfo;
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>;
    tokenList: TokenInfo[];
};

const TimeInfo = ({
    date,
    setDate,
    availableHours,
    selectedToken,
    setSelectedToken,
    tokenList,
}: TimeInfoProps) => {
    const handleSelectedHour = (hour: number) => {
        if (date.hours.includes(hour)) {
            setDate({ ...date, hours: date.hours.filter((selectedHour) => selectedHour !== hour) });
        } else {
            setDate({ ...date, hours: [...date.hours, hour] });
        }
    };

    const formatTime = (hour: number) => {
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
        const period = hour <= 12 ? "AM" : "PM";
        return `${formattedHour}:00 ${period}`;
    };

    return (
        <div className="py-5 w-64">
            {availableHours.length === 0 ? (
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
                        {availableHours.map((hour, index) => (
                        <li
                            key={`hour-${index}`}
                            className={`rounded-lg py-1 cursor-pointer border-gray-800 border text-gray-800 dark:text-gray-100 ${
                                date.hours.includes(hour)
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                            }`}
                            onClick={() => handleSelectedHour(hour)}
                        >
                            {date.hours.includes(hour)
                                ? `Selected ${formatTime(hour)}`
                                : `Select ${formatTime(hour)}`
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
