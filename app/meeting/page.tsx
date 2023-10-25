import Calendar from "@/components/calendar/Calendar";
import { DateProps, MeetingProps, PricesMap } from "./types";

async function fetchPrice(toCurrency: string, fromCurrency = 'EUROe') {
    try {
        const apiUrl = `https://price.jup.ag/v4/price?ids=${fromCurrency}&vsToken=${toCurrency}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const tokenData = data.data[fromCurrency];
        const conversionRate = tokenData.price;

        const multiplier = 100;
        const truncatedRate = Math.floor(conversionRate * multiplier) / multiplier;

        return truncatedRate;
    } catch (error) {
        throw new Error(`Error fetching conversion rate`);
    }
}

async function getInitialProps(): Promise<MeetingProps> {
    const availableSlots: string[] = ['17:00', '17:15', '17:30', '17:45'];
    const currentDate = new Date();
    const initialDate: DateProps = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate() + 1,
        hours: [],
    };

    const euroPrice = 20;
    const [solPrice, usdcPrice] = await Promise.all([
        fetchPrice('SOL').then(price => price * euroPrice),
        fetchPrice('USDC').then(price => price * euroPrice),
    ]);

    const prices: PricesMap = {
        EUR: euroPrice,
        SOL: parseFloat(solPrice.toFixed(2)),
        USDC: parseFloat(usdcPrice.toFixed(2)),
    };

    return {
        initialDate,
        availableSlots,
        prices,
    };
}


export default async function Page() {
    const { initialDate, availableSlots, prices } = await getInitialProps()

    return (
        <main className="flex md:flex-col items-center justify-center">
            <Calendar 
                initialDate={initialDate} 
                availableSlots={availableSlots} 
                prices={prices}
            />
        </main>
    );
}