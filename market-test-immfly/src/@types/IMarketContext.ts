// Price interface for different currencies
export interface IPrice {
    EUR: number;
    Libras: number;
    USD: number;
}

// Item interface
export interface IItem {
    id: number;
    name: string;
    stock: number;
    price: IPrice;
}

// Item interface extended for cart products (with their quantity)
export interface ICartProduct extends IItem {
    quantity: number;
}

// Context interface
export interface IMarketContext {
    items: IItem[] // Available items
    finalPrice: IPrice; // Total price of cart
    cart: ICartProduct[]; // Cart products
    currency: keyof IPrice; // Selected currency

    getItems: TGetItemsFC;
    setItems: TSetItemsFC;
    setCurrency: TSetCurrencyFC;
    initContext: TInitContextFC;
    resetDatbase: () => TResetDatabseFC;
    setCartProducts: TSetCartProductsFC;
    calculateFinalPrice: TCalculateFinalPriceFC;
}

// Function type definitions for MarketContext
export type TInitContextFC = () => void;
export type TResetDatabseFC = Promise<void>;
export type TSetItemsFC = () => Promise<any>;
export type TGetItemsFC = () => Promise<IItem[]>;
export type TSetCurrencyFC = (currency: keyof IPrice) => void;
export type TSetCartProductsFC = (products: ICartProduct[]) => void;
export type TCalculateFinalPriceFC = (cartProducts: ICartProduct[]) => void;

// Default values for MarketContext
export const defaultMarketValue: IMarketContext = {
    cart: [],
    items: [],
    finalPrice: { EUR: 0, USD: 0, Libras: 0 },
    currency: 'EUR',

    initContext: () => {},
    setCurrency: () => {},
    setCartProducts: () => {},
    calculateFinalPrice: () => {},
    getItems: () => Promise.reject(null),
    setItems: () => Promise.reject(null),
    resetDatbase: () => Promise.reject(null),
};

// Pricing options
export const OPTIONS = {
    BUSINESS: { label: 'Business', ratio: 1.2 },
    RETAIL: { label: 'Retail', ratio: 1.0 },
    CREW: { label: 'Crew', ratio: 0.6 },
    HAPPY_HOUR: { label: 'Happy Hour', ratio: 0.5 },
    INVITACION_BUSINESS: { label: 'Invitación Business', ratio: 0.3 },
    INVITACION_TURISTA: { label: 'Invitación Turista', ratio: 0.4 },
} as const;

// Type for options values
export type OptionValue = typeof OPTIONS[keyof typeof OPTIONS];
