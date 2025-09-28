import React, { PropsWithChildren, useEffect } from 'react';
import { createContext, useState } from 'react';
import { defaultMarketValue, ICartProduct, IItem, IMarketContext, IPrice, TGetItemsFC, TSendPaymentFC, TSetItemsFC } from '@/@types/IMarketContext';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';
import { uploadRandomProducts } from '@/database/uploadMock';

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
        await uploadRandomProducts();
        await getItems();
        initContext();
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
        const productsCol = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCol);
        const productsList: IItem[] = productsSnapshot.docs.map(doc => (doc.data() as IItem));

        setMarketItems(productsList as unknown as IItem[]);
        return productsList as unknown as IItem[];
    };

    // Update items after payment
    const setItems: TSetItemsFC = async (): Promise<void> => {
        try {
            for (let item of cart) {

                // Query to find the product by its id
                const productQuery = query(
                    collection(db, 'products'),
                    where('id', '==', item.id)
                );

                const querySnapshot = await getDocs(productQuery);

                if (!querySnapshot.empty) {
                    const productDoc = querySnapshot.docs[0];
                    const productRef = productDoc.ref;

                    // Update stock, ensuring it doesn't go below zero
                    await updateDoc(productRef, {
                        stock: Math.max(productDoc.data().stock - item.quantity, 0)
                    });
                }
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    // Simulate payment process
    const sendPayment: TSendPaymentFC = async (): Promise<boolean> => {
        return true;
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