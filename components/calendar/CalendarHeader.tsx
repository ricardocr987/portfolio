import { DateProps } from "@/app/meeting/types";

type CalendarHeaderProps = {
    date: DateProps
    setDate: React.Dispatch<React.SetStateAction<DateProps>>
}

function CalendarHeader({ date, setDate }: CalendarHeaderProps) {
    const handleMonthIncrease = () => {
        const newMonth = date.month === 11 ? 0 : date.month + 1;
        const newYear = date.month === 11 ? date.year + 1 : date.year;
        setDate({ year: newYear, month: newMonth, day: undefined, hours: [] });
    };

    const handleMonthDecrease = () => {
        const newMonth = date.month === 0 ? 11 : date.month - 1;
        const newYear = date.month === 0 ? date.year - 1 : date.year;
        setDate({ year: newYear, month: newMonth, day: undefined, hours: [] });
    };

    const getMonthName = (monthIndex: number) => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return months[monthIndex];
    };

    const leftArrowIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-chevron-left"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="15 6 9 12 15 18" />
        </svg>
    );

    const rightArrowIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="9 6 15 12 9 18" />
        </svg>
    );

    return (
        <div className="flex justify-between pt-2 pb-5">
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <button
                        className="hover:text-gray-400 text-gray-800 dark:text-gray-100"
                        onClick={handleMonthDecrease}
                    >
                        {leftArrowIcon}
                    </button>
                    <span className="focus:outline-none text-base font-bold dark:text-gray-100 text-gray-800">
                        {getMonthName(date.month)} {date.year}
                    </span>
                    <button
                        className="hover:text-gray-400 text-gray-800 dark:text-gray-100"
                        onClick={handleMonthIncrease}
                    >
                        {rightArrowIcon}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CalendarHeader;
