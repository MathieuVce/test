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

type ItemCardProps = {
    id: number;
    title: string;
    price: IPrice;
    stock: number;
    selected: boolean;
    onPress: () => void;
};

const ItemCard = ({ id, title, price, stock, selected, onPress }: ItemCardProps) => {
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
            style={selected ? {...styles.cardSelected, borderColor: stock - quantity === 0 ? 'red' : '#3d38f5' } : styles.card}
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
                        <ActivityIndicator size='large' color='#fff' />
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
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    cardSelected: {
        width: Dimensions.get('window').width / 2 - 12,
        aspectRatio: 1,
        marginBottom: 8,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#3d38f5',
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    imageStyle: {
        borderRadius: 8,
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -24,
        backgroundColor: 'rgba(0,0,0,0.2)',
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
        color: 'black',
        fontSize: 16,
        fontWeight: '900',
    },
    stock: {
        color: 'grey',
        fontSize: 12,
        marginTop: 2,
    },
    price: {
        backgroundColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#3d38f5',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    counterBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 4,
    },
    counterButton: {
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    counterText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    counterValue: {
        color: 'white',
        fontSize: 18,
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
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    disabledText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 38,
    },
});
