import React from 'react';
import { ROUTES } from '@/@types/staticKeys';
import { Button, StyleSheet, View } from 'react-native';
import { AppModelNavProps } from '@/roots/AppModelNavigator';

type TCartProps = AppModelNavProps<typeof ROUTES.SCREEN_CART>;

export const Cart: React.FC<TCartProps> = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Button title='Go to Products' onPress={() => navigation.navigate(ROUTES.SCREEN_PRODUCTS)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});