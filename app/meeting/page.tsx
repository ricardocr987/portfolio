import Calendar from "@/components/calendar/Calendar";
import { DateProps } from "./types";

function Meeting() {
    // should be via api
    const availableHours: number[] = [9, 12, 13, 17];
    const currentDate = new Date();
    const initialDate: DateProps = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate() + 1,
        hours: [],
    };
    return (
        <main className="flex md:flex-col items-center justify-center">
            <Calendar initialDate={initialDate} availableHours={availableHours}/>
        </main>
    );
}
export default Meeting;
