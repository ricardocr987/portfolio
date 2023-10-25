export type DateProps = {
    year: number
    month: number
    day?: number
    hours: string[]
}

export type TokenInfo = {
    symbol: string
    image: string
    price: number
}

export type PricesMap = {
    EUR: number,
    USDC: number,
    SOL: number
};

export type MeetingProps = {
    initialDate: DateProps
    availableSlots: string[]
    prices: PricesMap
}