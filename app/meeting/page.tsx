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
    
        const multiplier = 10 ** 2;
        const truncatedRate = Math.floor(conversionRate * multiplier) / multiplier;

        return truncatedRate;
    } catch (error) {
         throw new Error(`Error fetching conversion rate`);
    }
}

async function getInitialProps(): Promise<MeetingProps> {
    const availableHours: number[] = [16, 17];
    const currentDate = new Date();
    const initialDate: DateProps = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate() + 1,
        hours: [],
    };

    const [solPrice, usdcPrice] = await Promise.all([
        fetchPrice('SOL').then(price => price * 50),
        fetchPrice('USDC').then(price => price * 50),
    ]);

    const prices: PricesMap = {
        EUR: 50,
        SOL: solPrice,
        USDC: usdcPrice
    };

    return {
        initialDate,
        availableHours,
        prices,
    };
}


export default async function Page() {
    const { initialDate, availableHours, prices } = await getInitialProps()

    return (
        <main className="flex md:flex-col items-center justify-center">
            <Calendar 
                initialDate={initialDate} 
                availableHours={availableHours} 
                prices={prices}
            />
        </main>
    );
}