import React, { ReactNode } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { COLORS, SIZES } from '@/utils/theme';

type FooterProps = {
    children?: ReactNode;
};

const Footer: React.FC<FooterProps> = ({ children }) => {
    return (
        <View style={styles.footerContainer}>
            {children}
        </View>
    );
};

export default Footer;

const styles = StyleSheet.create({
    footerContainer: {
        alignItems: 'center',
        backgroundColor: COLORS.white,
        minHeight: 138,
        marginBottom: 20,
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        padding: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
});
