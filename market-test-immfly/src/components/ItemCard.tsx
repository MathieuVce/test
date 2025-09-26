import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Image,
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
    quantity?: number;
    isBig?: boolean;
    onPress: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({ id, title, price, stock, selected, quantity: quantityProps, isBig = false, onPress }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(quantityProps ?? 0);

    const { currency, cart, setCartProducts } = useContext(MarketContext);
    const isDisabled = stock === 0;

    // Sync cart with local quantity
    useEffect(() => {
        const newCart = cart.filter(prod => prod.id !== id);

        if (quantity > 0) {
            setCartProducts([...newCart, { id, name: title, price, stock, quantity: quantity }]);
        } else {
            setCartProducts(newCart);
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
        if (quantity < stock) {
            setQuantity(quantity + 1);
        }
    };

    // Decrease quantity
    const decrement = () => {
        if (quantity > 0) {
            setQuantity( quantity - 1);
        }
    };

    return (
        <>
            { isBig ? (
                <View style={stylesBig.container}>
                    <Image
                        source={require('@/assets/can.png')}
                        style={stylesBig.image}
                        resizeMode='contain'
                    />

                    <Text style={stylesBig.title}>{title}</Text>

                    {/* Quantity */}
                    <View style={stylesBig.stockContainer}>
                        <Text style={stylesBig.stock}>
                            {stock - quantity} {(stock - quantity) <= 1 ? 'unidad disponible' : 'unidades disponibles'}
                        </Text>
                    </View>

                    {/* Price */}
                    <Text style={stylesBig.price}>
                        {currency === 'EUR' && `${(price[currency] * quantity).toFixed(2)} €`}
                        {currency === 'USD' && `${(price[currency] * quantity).toFixed(2)} $`}
                        {currency === 'Libras' && `${(price[currency] * quantity).toFixed(2)} £`}
                    </Text>

                    {/* Counter */}
                    <View style={stylesBig.counterBox}>
                        <TouchableOpacity style={stylesBig.counterButton} disabled={quantity === 0} onPress={decrement}>
                            <Text style={stylesBig.counterText}>-</Text>
                        </TouchableOpacity>

                        <Text style={stylesBig.counterValue}>{quantity}</Text>

                        <TouchableOpacity style={stylesBig.counterButton} disabled={stock - quantity === 0}  onPress={increment}>
                            <Text style={stylesBig.counterText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
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
                                <Text style={styles.price}>
                                    {currency === 'EUR' && `${price[currency].toFixed(2)} €`}
                                    {currency === 'USD' && `${price[currency].toFixed(2)} $`}
                                    {currency === 'Libras' && `${price[currency].toFixed(2)} £`}
                                </Text>
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
            )}
        </>
    );
};

export default ItemCard;

const stylesBig = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 150,
        height: 150,
        transform: [{ scale: 1.4 }],
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 4,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        ...FONTS.regularBold,
        marginBottom: 4,
        fontSize: scaleSize(20),
    },
    stockContainer: {
        paddingHorizontal: 12,
        marginBottom: 12,
        width: 200,
    },
    stock: {
        fontSize: scaleSize(12),
        color: COLORS.grey,
        textAlign: 'center',
    },
    price: {
        fontSize: scaleSize(18),
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 12,
    },
    counterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGrey,
        borderRadius: SIZES.radius * 2,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 4,
    },
    counterButton: {
        paddingHorizontal: 24,
    },
    counterText: {
        ...FONTS.regularBold,
        fontSize: scaleSize(22),
    },
    counterValue: {
        ...FONTS.regularBold,
        fontSize: scaleSize(20),
        marginHorizontal: moderateScale(16),
    },
});

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
