import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '@/utils/theme';
import Footer from '@/components/Footer';
import { scaleSize } from '@/utils/global';
import { ROUTES } from '@/@types/staticKeys';
import ItemList from '@/components/ItemList';
import { ItemModal } from '@/components/ItemModal';
import PaymentView from '@/components/PaymentView';
import GenericScreen from '@/components/GenericScreen';
import { ICartProduct } from '@/@types/IMarketContext';
import { MarketContext } from '@/contexts/MarketContext';
import { AppModelNavProps } from '@/roots/AppModelNavigator';

type TCartProps = AppModelNavProps<typeof ROUTES.SCREEN_CART>;

export const Cart: React.FC<TCartProps> = ({ navigation, route }) => {
    const { cart, setCartProducts, currency, setItems, sendPayment } = useContext(MarketContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [isFreezed, setIsFreezed] = useState<boolean>(false);
    const [item, setItem] = useState<ICartProduct>();
    const ratio = route.params?.ratio || 1;

    // Delete item from cart
    const handleDelete = (id: number) => {
        cart.splice(cart.findIndex(item => item.id === id), 1);
        setCartProducts(cart ? [...cart] : []);
    };

    // Sort cart items by price asc
    useEffect(() => {
        cart.sort((a, b) => a.price[currency] - b.price[currency]);
    }, [cart, currency]);

    const handlePaymentSuccess = async () => {
        setLoading(true);
        const paymentResult = await sendPayment();
        if (paymentResult) {
            await setItems();
            navigation.navigate(ROUTES.SCREEN_PRODUCTS);
            setLoading(false);
            return;
        }
        setLoading(false);
        setIsFreezed(false);
    }

    // Show modal on item press if payment is not in progress
    const handleOnPress = (item: ICartProduct) => {
        if (!isFreezed) {
            setVisible(true);
            setItem(item);
        }
    };

    return (
        <>
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <GenericScreen title='Ticket' description='Productos seleccionados'>
                    {cart.length === 0 && (
                        <Text style={styles.empty}>El carrito está vacío</Text>
                    )}
                    <ScrollView showsVerticalScrollIndicator={false} disableScrollViewPanResponder={isFreezed}>
                        <View style={styles.container}>
                            {cart.map((item, index) => (
                                <ItemList
                                    key={index}
                                    item={item}
                                    onPress={() => { handleOnPress(item)}}
                                    onDelete={() => { handleDelete(item.id) }}
                                    isFreezed={isFreezed}
                                />
                            ))}
                        </View>
                    </ScrollView>
                    <ItemModal visible={visible} item={item!} onClose={() => {setVisible(false)}} onDelete={() => {handleDelete(item?.id!)}}/>
                    <TouchableOpacity style={styles.payButton} onPress={() => setIsFreezed(true)}>
                        <Text style={styles.payButtonText}>PAGAR</Text>
                    </TouchableOpacity>
                    {isFreezed && (
                        <Footer>
                            <PaymentView ratio={ratio} onPaymentSuccess={handlePaymentSuccess} />
                        </Footer>
                    )}
                </GenericScreen>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        paddingVertical: 2,
        paddingHorizontal: 6,
    },
    empty: {
        textAlign: 'center',
        marginVertical: 20,
        color: COLORS.grey,
        fontSize: scaleSize(16),
    },
    payButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    payButtonText: {
        color: COLORS.white,
        fontSize: scaleSize(16),
        fontWeight: 'bold',
    },
});