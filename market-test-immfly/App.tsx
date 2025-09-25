import React from 'react';
import { MarketProvider } from '@/contexts/MarketContext';
import { AppModelNavigator } from '@/roots/AppModelNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaProvider>
            <MarketProvider>
                <NavigationContainer>
                    <AppModelNavigator />
                </NavigationContainer>
            </MarketProvider>
        </SafeAreaProvider>
    );
}