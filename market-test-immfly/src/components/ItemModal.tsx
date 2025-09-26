import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import ItemCard from './ItemCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '@/utils/theme';
import { ICartProduct } from '@/@types/IMarketContext';

type ItemModalProps = {
    item: ICartProduct;
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
};

export const ItemModal: React.FC<ItemModalProps> = ({
    item,
    visible,
    onClose,
    onDelete,
}) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>

                    {item && (
                        <ItemCard
                            key={item.id}
                            id={item.id}
                            title={item.name}
                            price={item.price}
                            stock={item.stock}
                            selected={true}
                            onPress={() => {}}
                            quantity={item.quantity}
                            isBig={true}
                        />
                    )}

                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton, { flex: 1 }]}
                            onPress={() => { onDelete(); onClose(); }}>
                            <Ionicons name='trash-outline' size={20} color={COLORS.white} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.validateButton, { flex: 3 }]}
                            onPress={onClose}>
                            <Text style={styles.buttonText}>Validar</Text>
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
    deleteButton: {
        backgroundColor: COLORS.red,
    },
    validateButton: {
        backgroundColor: COLORS.primary,
    },
    buttonText: {
        ...FONTS.regularBold,
        color: COLORS.white,
        marginLeft: 6,
    },
});
