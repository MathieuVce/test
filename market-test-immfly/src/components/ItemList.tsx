import React, { useContext } from "react";
import { View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "@/utils/theme";
import { scheduleOnRN } from "react-native-worklets";
import { ICartProduct } from "@/@types/IMarketContext";
import { MarketContext } from "@/contexts/MarketContext";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";

type CartItemProps = {
    item: ICartProduct;
    onPress: () => void;
    onDelete: () => void;
    isFreezed?: boolean;
};

const CartItem: React.FC<CartItemProps> = ({ item, onPress, onDelete, isFreezed = false }) => {
    const { currency } = useContext(MarketContext);

    const translateX = useSharedValue(0);
    const scale = useSharedValue(1);

    const panGesture = Gesture.Pan()
        .enabled(!isFreezed) // Disable gesture if freezed
        .activeOffsetX([-15, 15])
        .failOffsetY([-5, 5])
        .onUpdate((event) => {
            // Move left only
            translateX.value = Math.min(0, event.translationX);
        })
        .onEnd((event) => {
            const threshold = -80;

            if (event.translationX < threshold) {
                // Delete animation
                translateX.value = withTiming(-400, { duration: 200 });
                scale.value = withTiming(0, { duration: 100 }, (finished) => {
                    if (finished) {
                        scheduleOnRN(onDelete);
                    }
                });
            } else {
                // Bouncing effect on release
                translateX.value = withSpring(0, {
                    damping: 8,
                    stiffness: 120,
                    mass: 0.7,
                    overshootClamping: false,
                });
            }
        });

    // Set opacity and translation based on gesture
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { scale: scale.value }
        ],
        opacity: 1 + translateX.value / 400,
    }));

    const deleteIconStyle = useAnimatedStyle(() => ({
        opacity: Math.min(1, Math.max(0, -translateX.value / 80)),
    }));

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <Animated.View style={[styles.deleteBackground, deleteIconStyle]}>
                <Ionicons name="trash-outline" size={24} color={COLORS.white} />
            </Animated.View>

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.itemContainer, animatedStyle]}>
                    <View style={styles.imageContainer}>
                        <Image source={require("@/assets/can.png")} style={styles.itemImage} />
                    </View>

                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {/* Total amount for items selected */}
                        <Text style={styles.itemPrice}>
                            {(item.price[currency] * item.quantity).toFixed(2)} {currency === "EUR" ? "€" : currency === "USD" ? "$" : "£"}
                        </Text>
                    </View>

                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </TouchableOpacity>
    );
};

export default CartItem;


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 8,
    },
    deleteBackground: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderRadius: SIZES.radius,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        width: '100%',
        backgroundColor: COLORS.white,
    },
    imageContainer: {
        width: 35,
        height: 35,
        paddingHorizontal: 6,
        borderRadius: SIZES.radius,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    itemImage: {
        width: 35,
        height: 35,
        borderRadius: 8,
        backgroundColor: COLORS.extraLightGrey,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    itemName: {
        ...FONTS.regularBold,
        marginHorizontal: 12,
    },
    itemPrice: {
        ...FONTS.regular,
        marginHorizontal: 24,
    },
    quantityContainer: {
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        color: COLORS.grey,
        ...FONTS.regular,
    },
});