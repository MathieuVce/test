import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SeatPicker from './SeatPicker';
import { COLORS } from '@/utils/theme';
import { scaleSize } from '@/utils/global';

const Asiento = () => {
    // Generate seat letters and numbers
    const letters = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));
    const numbers = Array.from({ length: 60 }, (_, i) => (i + 1).toString());
    const [selectedLetter, setSelectedLetter] = useState<string>(letters[0]);
    const [selectedNumber, setSelectedNumber] = useState<string>(numbers[0]);

    const onConfirm = (letter: string, number: string) => {
        setSelectedLetter(letter);
        setSelectedNumber(number);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>ASIENTO</Text>
            <SeatPicker
                letters={letters}
                numbers={numbers}
                selectedLetter={selectedLetter}
                selectedNumber={selectedNumber}
                onConfirm={onConfirm}
            />
        </View>
    );
};

export default Asiento;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12
    },
    label: {
        color: COLORS.grey,
        fontSize: scaleSize(16),
    },
});