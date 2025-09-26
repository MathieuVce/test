import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import { Products } from '@/screens/Products';
import { Cart } from '@/screens/Cart';

interface IAppModelNavProps {}

// Define the navigation parameter list
type AppModelNavParamList = {
    Products: undefined;
    Cart: { ratio: number };
};

// Type for navigation and route props for each screen
export type AppModelNavProps<T extends keyof AppModelNavParamList> = {
    navigation: StackNavigationProp<AppModelNavParamList, T>;
    route: RouteProp<AppModelNavParamList, T>;
};

const RootStack = createStackNavigator<AppModelNavParamList>();

export const AppModelNavigator: React.FC<IAppModelNavProps> = () => (
    <RootStack.Navigator
        initialRouteName='Products'
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_bottom'
        }}
    >
        <RootStack.Screen name='Products' component={Products} />
        <RootStack.Screen name='Cart' component={Cart} />
    </RootStack.Navigator>
);
