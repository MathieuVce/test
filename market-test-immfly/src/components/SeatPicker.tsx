import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SIZES } from '@/utils/theme';
import { scaleSize } from '@/utils/global';

type SeatPickerProps = {
    letters: string[];
    numbers: string[];
    selectedLetter: string;
    selectedNumber: string;
    onConfirm: (letter: string, number: string) => void;
};

const SeatPicker = ({
    letters,
    numbers,
    selectedLetter,
    selectedNumber,
    onConfirm,
}: SeatPickerProps) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [tempLetter, setTempLetter] = useState<string>(selectedLetter);
    const [tempNumber, setTempNumber] = useState<string>(selectedNumber);

    const handleConfirm = () => {
        if (tempLetter && tempNumber) {
            onConfirm(tempLetter, tempNumber);
        }
        setModalVisible(false);
    };

    const handleCancel = () => {
        setTempLetter(selectedLetter);
        setTempNumber(selectedNumber);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.pickerButtonText}>
                    {`${selectedLetter}   ${selectedNumber}`}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType='fade'
                onRequestClose={handleCancel}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={handleCancel}>
                                <Text style={styles.cancelButton}>Cancelar</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Asiento</Text>
                            <TouchableOpacity onPress={handleConfirm}>
                                <Text style={styles.confirmButton}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.pickerRow}>
                            <Picker
                                selectedValue={tempLetter ?? ''}
                                onValueChange={(val) => setTempLetter(val)}
                                style={styles.picker}
                            >
                                {letters.map((letter) => (
                                    <Picker.Item
                                        key={letter}
                                        label={letter}
                                        value={letter}
                                    />
                                ))}
                            </Picker>

                            <Picker
                                selectedValue={tempNumber ?? ''}
                                onValueChange={(val) => setTempNumber(val)}
                                style={styles.picker}
                            >
                                {numbers.map((num) => (
                                    <Picker.Item
                                        key={num}
                                        label={num}
                                        value={num}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default SeatPicker;

const styles = StyleSheet.create({
    pickerButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGrey,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        elevation: 2,
        marginVertical: 6,
        width: 80,
    },
    pickerButtonText: {
        fontSize: scaleSize(17),
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.darkOpacity,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.extraLightGrey,
    },
    modalTitle: {
        fontSize: scaleSize(18),
        fontWeight: '600',
    },
    cancelButton: {
        fontSize: scaleSize(16),
        color: COLORS.primary,
    },
    confirmButton: {
        fontSize: scaleSize(16),
        color: COLORS.primary,
        fontWeight: '600',
        backgroundColor: COLORS.lightPrimary,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: SIZES.radius,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    picker: {
        flex: 1,
        height: 200,
    },
});
