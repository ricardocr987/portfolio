'use client'

import React, { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import DayNames from "./DayNames";
import CalendarContent from "./CalendarContent";
import TimeInfo from "@/components/calendar/TimeInfo";
import { DateProps, TokenInfo } from "@/app/meeting/types";
import { changeTokenInfo } from "@/lib/constants";
import PaymentComponent from "./PaymentComponent";

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
  const [formData, setFormData] = useState({
    customerEmail: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
    <div className="md:flex md:space-x-3 pt-4">
      <div className="h-[310px]">
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
      <div className="flex flex-col dark:text-black md:mt-8 md:w-56">
        <input
          className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="customerEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
          value={formData.customerEmail}
          onChange={handleChange}
        />
        <textarea
          className="h-56 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="message"
          placeholder="Your message"
          required
          maxLength={5000}
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col">
        <TimeInfo
          date={date}
          setDate={setDate}
          availableSlots={availableSlots}
        />
        <PaymentComponent
          setSelectedToken={setSelectedToken}
          selectedToken={selectedToken}
          tokenList={tokenList}
          date={date}
          customerEmail={formData.customerEmail}
          message={formData.message}
        />
      </div>
    </div>
  );
};
export default Calendar;