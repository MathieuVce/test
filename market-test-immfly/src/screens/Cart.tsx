import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { COLORS } from '@/utils/theme';
import { ROUTES } from '@/@types/staticKeys';
import ItemList from '@/components/ItemList';
import { ItemModal } from '@/components/Modal';
import GenericScreen from '@/components/GenericScreen';
import { ICartProduct } from '@/@types/IMarketContext';
import { MarketContext } from '@/contexts/MarketContext';
import { AppModelNavProps } from '@/roots/AppModelNavigator';
import { scaleSize } from '@/utils/global';

type TCartProps = AppModelNavProps<typeof ROUTES.SCREEN_CART>;

export const Cart: React.FC<TCartProps> = () => {
    const { cart, setCartProducts, currency } = useContext(MarketContext);
    const [visible, setVisible] = useState<boolean>(false);
    const [item, setItem] = useState<ICartProduct>();

    const handleDelete = (id: number) => {
        cart.splice(cart.findIndex(item => item.id === id), 1);
        setCartProducts(cart ? [...cart] : []);
    };

    // sort cart items by price asc
    useEffect(() => {
        cart.sort((a, b) => a.price[currency] - b.price[currency]);
    }, [cart, currency]);

    return (
        <GenericScreen title='Ticket' description='Productos seleccionados'>
            {cart.length === 0 && (
                <Text style={styles.empty}>El carrito está vacío</Text>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {cart.map((item, index) => (
                        <ItemList
                            key={index}
                            item={item}
                            onPress={() => { setVisible(true); setItem(item); }}
                            onDelete={() => {handleDelete(item.id)}}
                        />
                    ))}
                </View>
            </ScrollView>
            <ItemModal visible={visible} item={item!} onClose={() => {setVisible(false)}} onDelete={() => {handleDelete(item?.id!)}}/>
        </GenericScreen>
    );
};

const styles = StyleSheet.create({
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
});