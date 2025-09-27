import React, { PropsWithChildren, useEffect } from 'react';
import { createContext, useState } from 'react';
import { defaultMarketValue, ICartProduct, IItem, IMarketContext, IPrice, TGetItemsFC, TSendPaymentFC, TSetItemsFC } from '@/@types/IMarketContext';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const MarketContext = createContext<IMarketContext>(defaultMarketValue);

export const MarketProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const baseUrl = 'https://us-central1-market-test-immfly.cloudfunctions.net'
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

    // Initialize context with default values
    const initContext = (): void => {
        setCart([]);
        setFinalPrice({ EUR: 0, USD: 0, Libras: 0 });
        setCurrencyState('EUR');
    };

    // Reset database and upload mock products
    const resetDatbase = async (): Promise<void> => {
        try {
            const res = await fetch(`${baseUrl}/reset`, {
                method: 'GET'
            });
            if (res.status === 200) {
                await getItems();
                initContext();
            }
        } catch (error) {
            console.error('Error resetting database', error);
        }
    };

    // Update cart products
    const setCartProducts = (products: ICartProduct[]): void => {
        setCart(products);
    };

    // Change currency state
    const setCurrency = (currency: keyof IPrice): void => {
        setCurrencyState(currency);
    };

    // Fetch items from Firestore
    const getItems: TGetItemsFC = async (): Promise<IItem[]> => {
        let productsList: IItem[] = [];
        try {
            const res = await fetch(`${baseUrl}/products`, {
                method: 'GET'
            });

            if (res.status === 200) {
                productsList = await res.json();
                setMarketItems(productsList);
            }
        } catch (error) {
            console.error(error);
        } finally {
            return productsList;
        }
    };

    // Update items after payment
    const setItems: TSetItemsFC = async (): Promise<void> => {
        try {
            const res = await fetch(`${baseUrl}/products`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart })
            });
            if (res.status === 200) return;
        } catch (error) {
            console.error('Error', error);
        }
    };

    // Simulate payment process
    const sendPayment: TSendPaymentFC = async (): Promise<boolean> => {
        try {
            const res = await fetch(`${baseUrl}/payment`, {
                method: 'GET'
            });
            if (res.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    // Provide context to children
    return (
        <MarketContext.Provider value={{ items,
            currency,
            cart,
            finalPrice,
            calculateFinalPrice,
            setCartProducts,
            setCurrency,
            getItems,
            setItems,
            initContext,
            resetDatbase,
            sendPayment }}
        >
            {children}
        </MarketContext.Provider>
    );
};