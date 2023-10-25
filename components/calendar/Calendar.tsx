'use client'

import React, { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import DayNames from "./DayNames";
import CalendarContent from "./CalendarContent";
import TimeInfo from "@/components/calendar/TimeInfo";
import { DateProps, TokenInfo } from "@/app/meeting/types";
import { changeTokenInfo } from "@/constants";

type PricesMap = {
  EUR: number,
  USDC: number,
  SOL: number
};

type CalendarProps = {
    initialDate: DateProps
    availableSlots: string[]
    prices: PricesMap
}

const Calendar = ({initialDate, availableSlots, prices}: CalendarProps) => {
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(
      changeTokenInfo('USDC', prices.USDC)
  );
  const [date, setDate] = useState<DateProps>(initialDate);

  useEffect(() => {
      setDate({ ...date, hours: [] });
  }, [date.day, date.month]);

  const tokenList: TokenInfo[] = [
    {
      symbol: 'USDC',
      image: './usdcLogo.svg',
      price: prices.USDC
    },
    {
      symbol: 'SOL',
      image: './solanaLogo.svg',
      price: prices.SOL
    }
  ];

  return (
    <div className="md:flex md:space-x-8">
      <div className="h-[380-px]">
        <table>
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
      </div>
      <TimeInfo
        date={date}
        setDate={setDate}
        availableSlots={availableSlots}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        tokenList={tokenList}
      />
    </div>
  );
};
export default Calendar;