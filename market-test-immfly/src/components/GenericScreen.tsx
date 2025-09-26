import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scaleSize } from '@/utils/global';
import { COLORS, SIZES } from '@/utils/theme';
import { MarketContext } from '@/contexts/MarketContext';

type GenericScreenProps = {
    title: string;
    description?: string;
    showArrow?: boolean;
    children: React.ReactNode;
};

const GenericScreen: React.FC<GenericScreenProps> = ({
    title,
    description = '',
    showArrow = false,
    children,
}) => {
    const { resetDatbase } = useContext(MarketContext);
    const [loaading, setLoading] = useState<boolean>(false);

    const handleResetDatabase = async () => {
        setLoading(true);
        await resetDatbase();
        setLoading(false);
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                        {description && <Text style={styles.description}>{description}</Text>}
                    </View>

                    <View style={styles.actions}>
                        {/* Delete and reset database onClick + fetch Items */}
                        {showArrow && (
                            <TouchableOpacity onPress={handleResetDatabase} disabled={loaading}>
                                <Ionicons name='chevron-down' size={scaleSize(32)} color={COLORS.lightGrey} />
                            </TouchableOpacity>
                        )}
                        <View style={styles.closeButton}>
                            <Ionicons name='close' size={scaleSize(26)} color={COLORS.purple} />
                        </View>
                    </View>
                </View>
                {/* Display children or loader */}
                <View style={styles.body}>
                    {loaading ? (
                        <>
                            <View style={styles.loader}>
                                <ActivityIndicator size="large" color={COLORS.purple} />
                            </View>
                        </>
                    ) : (
                        children
                    )}
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
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    description: {
        fontSize: scaleSize(16),
        color: COLORS.grey,
        marginTop: 4,
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
    },
    loader: {
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
