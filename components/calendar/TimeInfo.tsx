import { Dispatch, SetStateAction } from "react";
import { DateProps } from "@/app/meeting/types";

type TimeInfo = {
    hour: number
    minute: number
}
type TimeInfoProps = {
    date: DateProps;
    setDate: Dispatch<SetStateAction<DateProps>>;
    availableSlots: string[];
};

const TimeInfo = ({
    date,
    setDate,
    availableSlots,
}: TimeInfoProps) => {
    const handleSelectedTime = (slot: string) => {
        if (date.hours.includes(slot)) {
            setDate({ ...date, hours: date.hours.filter((selectedTime) => selectedTime !== slot) });
        } else {
            setDate({ ...date, hours: [...date.hours, slot] });
        }
    };

    return (

                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Available Time - 20 €/slot
                    </h2>
                    <ul className="mt-2 space-y-2 text-center w-full">
                        {availableSlots.map((slot, index) => (
                            <li
                                key={`hour-${index}`}
                                className={`rounded-lg py-1 w-full cursor-pointer border-gray-800 border text-gray-800 dark:text-gray-100 ${
                                    date.hours.includes(slot)
                                        ? 'bg-blue-500'
                                        : 'bg-green-500'
                                }`}
                                onClick={() => handleSelectedTime(slot)}
                            >
                                {date.hours.includes(slot)
                                    ? `Selected ${slot} CEST`
                                    : `Select ${slot} CEST`
                                }
                            </li>
                        ))}
                    </ul>
                </div>
    );
};

export default TimeInfo;
