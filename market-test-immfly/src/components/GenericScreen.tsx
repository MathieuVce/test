import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scaleSize } from '@/utils/global';
import { COLORS, SIZES } from '@/utils/theme';

type GenericScreenProps = {
    title: string;
    showArrow?: boolean;
    children: React.ReactNode;
};

const GenericScreen: React.FC<GenericScreenProps> = ({
    title,
    showArrow = false,
    children,
}) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.actions}>
                        {showArrow && (
                            <TouchableOpacity onPress={() => {}}>
                                <Ionicons name='chevron-down' size={scaleSize(32)} color={COLORS.lightGrey} />
                            </TouchableOpacity>
                        )}
                        <View style={styles.closeButton}>
                            <Ionicons name='close' size={scaleSize(26)} color={COLORS.purple} />
                        </View>
                    </View>
                </View>
                <View style={styles.body}>
                    {children}
                </View>
            </View>
        </View>
    );
}

export default GenericScreen;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: COLORS.lightSteelBlue,
    },
    container: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        paddingTop: 12,
        minHeight: '93%',
    },
    header: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 18,
        marginBottom: 6,
    },
    title: {
        fontSize: scaleSize(32),
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: COLORS.extraLightGrey,
        borderRadius: 24,
        padding: 10,
        marginLeft: scaleSize(24),
    },
    body: {
        flex: 1,
        backgroundColor: COLORS.greyLight,
        paddingTop: 6,
    },
});
