'use client'

import React, { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import DayNames from "./DayNames";
import CalendarContent from "./CalendarContent";
import TimeInfo from "@/components/calendar/TimeInfo";
import { DateProps, TokenInfo } from "@/app/meeting/types";
import { changeTokenInfo, tokenList } from "@/constants";

type CalendarProps = {
    initialDate: DateProps
    availableHours: number[]
}

const Calendar = ({initialDate, availableHours}: CalendarProps) => {
    const [selectedToken, setSelectedToken] = useState<TokenInfo>(
        changeTokenInfo(tokenList[0].price, tokenList[0].symbol)
    );
    const [date, setDate] = useState<DateProps>(initialDate);
    
    useEffect(() => {
        setDate({ ...date, hours: [] });
    }, [date.day, date.month]);

    return (
        <div className="md:flex p-8 w-96">
          <table className="w-full">
            <thead>
              <tr>
                <th colSpan={7}>
                  <CalendarHeader date={date} setDate={setDate} />
                </th>
              </tr>
            </thead>
            <thead>
              <DayNames />
            </thead>
            <tbody>
              <CalendarContent date={date} setDate={setDate} />
            </tbody>
          </table>
          <TimeInfo
            date={date}
            setDate={setDate}
            availableHours={availableHours}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
            tokenList={tokenList}
          />
        </div>
      );
    };
export default Calendar;
