import React, { useContext, useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '@/utils/theme';
import { MarketContext } from '@/contexts/MarketContext';

type PaymentModalProps = {
    amount: string;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
    total: number;
    visible: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
    amount,
    setAmount,
    total,
    visible,
    onClose,
    onPaymentSuccess,
}) => {
    const [isValid, setIsValid] = useState<boolean>(false);
    const { currency, cart } = useContext(MarketContext);

    const handleChange = (text: string) => {
        setAmount(text);
    };

    // Validate amount input
    useEffect(() => {
        const numericValue = parseFloat(amount.replace(',', '.'));

        // Check if numericValue is a valid number and between 0 and total if cart not empty
        if (!isNaN(numericValue) && numericValue > 0 && numericValue <= total || cart.length === 0) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [amount, total]);

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>

                    <Text style={styles.title}>Total a pagar: {total} {currency}</Text>
                    <TextInput
                        style={[
                            styles.input,
                            !isValid && amount.length > 0 ? {...styles.input, borderColor: COLORS.red } : {}
                        ]}
                        keyboardType='numeric'
                        value={amount}
                        onChangeText={handleChange}
                        placeholder='0,00'
                    />

                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton, { flex: 1.3 }]}
                            onPress={onClose}>
                        <Text style={styles.buttonText}>Cancelar</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.validateButton, { flex: 2 }]}
                            onPress={() => {onClose(); onPaymentSuccess(); }}
                            disabled={!isValid}>
                            <Text style={styles.buttonText}>Pagar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.darkOpacity,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        position: 'relative',
    },
    title: {
        ...FONTS.h2,
        marginBottom: 12
    },
    input: {
        width: '88%',
        height: 40,
        borderColor: COLORS.grey,
        borderWidth: 1,
        borderRadius: SIZES.radius,
        paddingHorizontal: 24,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: SIZES.radius,
    },
    cancelButton: {
        backgroundColor: COLORS.primary,
    },
    validateButton: {
        backgroundColor: COLORS.secondary,
    },
    buttonText: {
        ...FONTS.regularBold,
        color: COLORS.white,
    },
});
