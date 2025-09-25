import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { IPrice } from '@/@types/IMarketContext';
import { MarketContext } from '@/contexts/MarketContext';
import { moderateScale, scaleSize } from '@/utils/global';
import { COLORS, FONTS, SIZES } from '@/utils/theme';

type ItemCardProps = {
    id: number;
    title: string;
    price: IPrice;
    stock: number;
    selected: boolean;
    onPress: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({ id, title, price, stock, selected, onPress }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(0);

    const { currency, cart, setCartProducts } = useContext(MarketContext);
    const isDisabled = stock === 0;

    // Sync cart with local quantity
    useEffect(() => {
        if (quantity > 0) {
            const newCart = cart.filter((prod) => prod.id !== id);
            setCartProducts([...newCart, { id, name: title, price, stock, quantity }]);
        } else {
            setCartProducts(cart.filter((prod) => prod.id !== id));
        }
    }, [quantity]);

    // Handle card selection
    const handleSelect = () => {
        if (isDisabled) return;
        if (!selected && quantity === 0) {
            setQuantity(1);
        }
        onPress();
    };

    // Increase quantity
    const increment = () => {
        if (quantity < stock) setQuantity(quantity + 1);
    };

    // Decrease quantity
    const decrement = () => {
        if (quantity > 0) setQuantity(quantity - 1);
    };

    return (
        <TouchableOpacity
            style={selected ? {...styles.cardSelected, borderColor: stock - quantity === 0 ? COLORS.red : COLORS.primary } : styles.card}
            activeOpacity={0.9}
            onPress={handleSelect}
            disabled={isDisabled}
        >
            {/* Background image */}
            <ImageBackground
                source={require('@/assets/can.png')}
                style={styles.image}
                imageStyle={styles.imageStyle}
                onLoadEnd={() => setLoading(false)}
            >
                {/* Loader while image loads */}
                {loading && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size='large' color={COLORS.white} />
                    </View>
                )}

                {/* Badge with quantity */}
                {quantity > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{quantity}</Text>
                    </View>
                )}

                {/* Product info (name, stock, price) */}
                <View style={styles.infoBox}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.stock}>
                            {stock - quantity} {(stock - quantity) <= 1 ? 'unidad' : 'unidades'}
                        </Text>
                    </View>
                    <View style={styles.rightColumn}>
                        {currency === 'EUR' && <Text style={styles.price}>{price[currency].toFixed(2)} €</Text>}
                        {currency === 'USD' && <Text style={styles.price}>{price[currency].toFixed(2)} $</Text>}
                        {currency === 'Libras' && <Text style={styles.price}>{price[currency].toFixed(2)} £</Text>}
                    </View>
                </View>

                {/* Counter shown only if selected */}
                {selected && (
                    <View style={styles.counterBox}>
                        <TouchableOpacity style={styles.counterButton} onPress={decrement}>
                            <Text style={styles.counterText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.counterValue}>{quantity}</Text>

                        <TouchableOpacity style={styles.counterButton} onPress={increment}>
                            <Text style={styles.counterText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ImageBackground>

            {/* If product is out of stock */}
            {isDisabled && (
                <View style={styles.disabledContainer}>
                    <Text style={styles.disabledText}>Agotado</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default ItemCard;

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width / 2 - 12,
        aspectRatio: 1,
        marginBottom: 8,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
    },
    cardSelected: {
        width: Dimensions.get('window').width / 2 - 12,
        aspectRatio: 1,
        marginBottom: 8,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    imageStyle: {
        borderRadius: SIZES.radius,
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -24,
        backgroundColor: COLORS.darkLightOpacity,
    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    leftColumn: {
        flexDirection: 'column',
    },
    rightColumn: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    title: {
        color: COLORS.black,
        fontSize: scaleSize(16),
        fontWeight: '900',
    },
    stock: {
        color: COLORS.grey,
        fontSize: scaleSize(12),
        marginTop: 2,
    },
    price: {
        backgroundColor: COLORS.black,
        paddingHorizontal: moderateScale(10),
        paddingVertical: 4,
        borderRadius: SIZES.radius * 2,
        color: COLORS.white,
        ...FONTS.regularBold,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius * 2,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: COLORS.white,
        ...FONTS.regularBold,
    },
    counterBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.darkOpacity,
        paddingVertical: scaleSize(4),
        borderRadius: SIZES.radius * 2,
        marginHorizontal: scaleSize(26),
        marginVertical: 4,
    },
    counterButton: {
        paddingHorizontal: 24,
        marginHorizontal: -8,
        borderRadius: SIZES.radius * 2,
    },
    counterText: {
        color: COLORS.white,
        fontSize: scaleSize(22),
        fontWeight: 'bold',
    },
    counterValue: {
        color: COLORS.white,
        fontSize: scaleSize(18),
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    disabledContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.darkOpacity,
    },
    disabledText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: scaleSize(34),
    },
});
