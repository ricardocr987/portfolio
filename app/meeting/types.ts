export type DateProps = {
    year: number
    month: number
    day?: number
    hours: number[]
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
    availableHours: number[]
    prices: PricesMap
}