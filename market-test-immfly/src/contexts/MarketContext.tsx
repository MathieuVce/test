import React, { PropsWithChildren, useEffect } from 'react';
import { createContext, useState } from 'react';
import { defaultMarketValue, ICartProduct, IItem, IMarketContext, IPrice, TGetItemsFC, TSetItemsFC } from '@/@types/IMarketContext';

export const MarketContext = createContext<IMarketContext>(defaultMarketValue);

export const MarketProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const mockItems: IItem[] = [
        { id: 1, name: 'Cocacola', stock: 4, price: { EUR: 2.5, Libras: 2.2, USD: 2.7 } },
        { id: 2, name: 'Cocacola', stock: 3, price: { EUR: 1.8, Libras: 1.6, USD: 2.0 } },
        { id: 3, name: 'Cocacola', stock: 0, price: { EUR: 3.7, Libras: 3.3, USD: 4.0 } },
        { id: 4, name: 'Cocacola', stock: 1, price: { EUR: 6.5, Libras: 5.8, USD: 7.0 } },
        { id: 5, name: 'Cocacola', stock: 6, price: { EUR: 4.9, Libras: 4.3, USD: 5.2 } },
        { id: 6, name: 'Cocacola', stock: 1, price: { EUR: 7.5, Libras: 6.9, USD: 8.2 } },
        { id: 7, name: 'Cocacola', stock: 5, price: { EUR: 5.9, Libras: 5.4, USD: 6.3 } },
        { id: 8, name: 'Cocacola', stock: 8, price: { EUR: 3.2, Libras: 2.9, USD: 3.5 } },
    ];

    const [items, setMarketItems] = useState<IItem[]>([]);
    const [currency, setCurrencyState] = useState<keyof IPrice>('EUR');
    const [cart, setCart] = useState<ICartProduct[]>([]);
    const [finalPrice, setFinalPrice] = useState<IPrice>({ EUR: 0, USD: 0, Libras: 0 });

    // Recalculate total price when cart changes
    useEffect(() => {
        calculateFinalPrice(cart);
    }, [cart]);

    // Calculate total price for all products in cart
    const calculateFinalPrice = (cartProducts: ICartProduct[]) => {
        const total: IPrice = { EUR: 0, USD: 0, Libras: 0 };

        cartProducts.forEach(item => {
            total.EUR += item.price.EUR * item.quantity;
            total.USD += item.price.USD * item.quantity;
            total.Libras += item.price.Libras * item.quantity;
        });

        setFinalPrice({
            EUR: Number(total.EUR.toFixed(2)),
            USD: Number(total.USD.toFixed(2)),
            Libras: Number(total.Libras.toFixed(2)),
        });
    };

    // Update cart products
    const setCartProducts = (products: ICartProduct[]): void => {
        setCart(products);
    };

    // Change currency state
    const setCurrency = (currency: keyof IPrice): void => {
        setCurrencyState(currency);
    };

    // Load items into market
    const getItems: TGetItemsFC = async (): Promise<IItem[]> => {
        setMarketItems(mockItems);
        return mockItems;
    };

    // Update items in market
    const setItems: TSetItemsFC = async (items: IItem[]): Promise<void> => {
        setMarketItems(items);
    };

    // Provide context to children
    return (
        <MarketContext.Provider value={{ items, currency, cart, finalPrice, calculateFinalPrice, setCartProducts, setCurrency, getItems, setItems }}>
            {children}
        </MarketContext.Provider>
    );
};