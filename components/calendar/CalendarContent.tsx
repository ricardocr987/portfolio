import { DateProps } from "@/app/meeting/types";
import React from "react";

type CalendarContentProps = {
    date: DateProps
    setDate: React.Dispatch<React.SetStateAction<DateProps>>
}

function CalendarContent({ date, setDate }: CalendarContentProps) {
    const renderCalendar = () => {
        const days = [];
        const totalDaysInMonth = new Date(date.year, date.month + 1, 0).getDate();
        let firstDayOfMonth = new Date(date.year, date.month, 0).getDay();
    
        let dayCounter = 1;
    
        for (let week = 0; dayCounter <= totalDaysInMonth; week++) {
            const weekDays = [];
    
            if (week === 0) {
                for (let i = 0; i < firstDayOfMonth; i++) {
                    weekDays.push(<td key={`empty-${i}`} />);
                }
            }
    
            for (let dayOfWeek = firstDayOfMonth; dayOfWeek < 7 && dayCounter <= totalDaysInMonth; dayOfWeek++) {
                const day = dayCounter;
                const currentDate = new Date();
                const isDisabled = currentDate > new Date(date.year, date.month, day);
    
                weekDays.push(
                    <td key={dayCounter}>
                        <div
                            className={`px-2 py-2 cursor-pointer flex w-full justify-center ${
                                isSelectedDay(day, date.month, date.year) ? 'bg-blue-500' : isDisabled ? 'bg-red-700' : 'bg-gray-400'
                            } ${isDisabled ? '' : 'hover:bg-blue-400'}`}
                            onClick={() => {
                                if (!isDisabled) {
                                    setDate({ ...date, day });
                                }
                            }}
                        >
                            <p className={`text-base text-gray-800 dark:text-gray-100 font-medium`}>{day}</p>
                        </div>
                    </td>
                );
                dayCounter++;
            }
    
            days.push(<tr className="h-4" key={`week-${week}`}>{weekDays}</tr>);
    
            firstDayOfMonth = 0;
        }
    
        return days;
    };

    const isSelectedDay = (day: number, month: number, year: number) => {
        return day === date.day && month === date.month && year === date.year;
    };

    return renderCalendar();
}

export default CalendarContent;
