import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type GenericScreenProps = {
    title: string;
    showArrow?: boolean;
    children: React.ReactNode;
};

const GenericScreen = ({
    title,
    showArrow = false,
    children,
}:  GenericScreenProps) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.actions}>
                        {showArrow && (
                            <TouchableOpacity onPress={() => {}}>
                                <Ionicons name='chevron-down' size={32} color='lightgrey' />
                            </TouchableOpacity>
                        )}
                        <View style={styles.closeButton}>
                            <Ionicons name='close' size={26} color='#65638e' />
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
        backgroundColor: '#9eb8c0',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
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
        fontSize: 32,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 24,
        padding: 10,
        marginLeft: 24,
    },
    body: {
        flex: 1,
        backgroundColor: '#dedede',
        paddingTop: 6,
    },
});
