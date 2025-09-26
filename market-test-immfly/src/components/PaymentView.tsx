import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Asiento from './Asiento';
import { scaleSize } from '@/utils/global';
import { Ionicons } from '@expo/vector-icons';
import { PaymentModal } from './PaymentModal';
import { COLORS, FONTS, SIZES } from '@/utils/theme';
import { MarketContext } from '@/contexts/MarketContext';

type PaymentViewProps = {
    ratio: number;
    onPaymentSuccess: () => void;
    setIsFreezed: React.Dispatch<React.SetStateAction<boolean>>
};

const PaymentView: React.FC<PaymentViewProps> = ({ ratio, onPaymentSuccess, setIsFreezed }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>('');

    const { currency, finalPrice, setItems, cart } = useContext(MarketContext);
    // Variable to handle partial payments
    const [localFinalPrice, setLocalFinalPrice] = useState<number>(Number((ratio * finalPrice[currency]).toFixed(2)));

    // Update local final price when cart changes
    useEffect(() => {
        setLocalFinalPrice(Number((ratio * finalPrice[currency]).toFixed(2)));
    }, [finalPrice]);

    const handlePayment = async () => {
        const numericAmount = parseFloat(amount.replace(',', '.'));

        if ((isNaN(numericAmount) || numericAmount <= 0) && cart.length !== 0 ) return;

        // If payment covers total or cart is empty update stock
        if (numericAmount === localFinalPrice || cart.length === 0) {
            await setItems();
            onPaymentSuccess();
            setLocalFinalPrice(0);
        } else {
            // Partial payment, freeze cart and update local price
            setIsFreezed(true);
            setLocalFinalPrice(prev => Number((prev - numericAmount).toFixed(2)));
        }

        setAmount('');
    };

    return (
        <>
            <View style={styles.topRow}>
                <Asiento />
                <View style={styles.totalContainer}>
                    <Text style={styles.headText}>TOTAL</Text>
                    <Text style={styles.totalAmount}>
                        {localFinalPrice}
                        <Text style={styles.currency}>
                            {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'}
                        </Text>
                    </Text>
                </View>
            </View>

            <View style={styles.grid}>
                <TouchableOpacity style={styles.gridItem} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name='cash-outline' size={scaleSize(40)} color={COLORS.white} />
                    </View>
                    <Text style={styles.gridText}>Efectivo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name='card-outline' size={scaleSize(40)} color={COLORS.white} />
                    </View>
                    <Text style={styles.gridText}>Tarjeta</Text>
                </TouchableOpacity>
            </View>
            <PaymentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onPaymentSuccess={handlePayment}
                total={localFinalPrice}
                amount={amount}
                setAmount={setAmount}
            />
        </>
    );
};

export default PaymentView;

const styles = StyleSheet.create({
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalContainer: {
        flex: 1,
        paddingTop: 12,
        marginRight: 12,
        alignItems: 'flex-end',
    },
    headText: {
        color: COLORS.grey,
        fontSize: scaleSize(16),
        marginBottom: scaleSize(4),
    },
    totalAmount: {
        ...FONTS.regularBold,
        fontSize: scaleSize(40),
    },
    currency: {
        fontSize: scaleSize(30),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '44%',
        height: scaleSize(145),
        backgroundColor: COLORS.black,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginBottom: 8,
        marginHorizontal: 8,
        paddingVertical: scaleSize(12),
    },
    iconWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    gridText: {
        color: COLORS.grey,
        fontSize: scaleSize(16),
        marginBottom: scaleSize(4),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.darkOpacity,
        justifyContent: 'flex-end',
    },
    modalContent: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '20%',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
