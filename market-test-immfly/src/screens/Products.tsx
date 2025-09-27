import React, { useContext, useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { scaleSize } from '@/utils/global';
import { ROUTES } from '@/@types/staticKeys';
import ItemCard from '@/components/ItemCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '@/utils/theme';
import GenericScreen from '@/components/GenericScreen';
import { MarketContext } from '@/contexts/MarketContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { AppModelNavProps } from '@/roots/AppModelNavigator';
import { OptionValue, OPTIONS, IPrice } from '@/@types/IMarketContext';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

type TProductsProps = AppModelNavProps<'Products'>;

export const Products: React.FC<TProductsProps> = ({ navigation }) => {
    const { currency, setCurrency, items, getItems, finalPrice, initContext } = useContext(MarketContext);

    const [price, setPrice] = useState<IPrice>({ EUR: 0, USD: 0, Libras: 0 });
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<OptionValue['label']>(OPTIONS.RETAIL.label);

    const [saleType, setSaleType] = useState(
        Object.values(OPTIONS).map((opt) => {
            // Truncate label if too long
            const label = opt.label.length > 14 ? opt.label.slice(0, 14) + "…" : opt.label;
            return {
                label,
                value: opt.label,
            };
        })
    );

    // Get sale ratio based on selected option
    const getRatio = (label: string) => Object.values(OPTIONS).find(opt => opt.label === label)?.ratio || 1;

    // Calculate and set final price based on selected ratio
    const calculatePrice = () => {
        const ratio = getRatio(value);
        setPrice({
            EUR: Number((finalPrice.EUR * ratio).toFixed(2)),
            USD: Number((finalPrice.USD * ratio).toFixed(2)),
            Libras: Number((finalPrice.Libras * ratio).toFixed(2)),
        });
    };

    // Fetch products from context
    const fetchItems = async () => {
        await getItems();
    };

    useEffect(() => {
        initContext();
        fetchItems();
    }, []);

    // Recalculate price when finalPrice or sale option changes
    useEffect(() => {
        calculatePrice();
    }, [finalPrice, value]);

    // Handle product selection toggle
    const handleSelectItem = (id: number) => {
        setSelectedId(prev => prev === id ? null : id);
    };

    // Function to change currency to display
    const changeCurrency = (option: 'first' | 'second') => {
        if (option === 'first') {
            setCurrency(currency === 'EUR' ? 'USD' : currency === 'USD' ? 'Libras' : 'EUR');
        } else {
            setCurrency(currency === 'EUR' ? 'Libras' : currency === 'USD' ? 'EUR' : 'USD');
        }
    };

    // Function to get alternate currency value
    const getCurrencyValue = (option: 'first' | 'second') => {
        if (option === 'first') {
            return currency === 'EUR'
                ? `${price['USD']} USD`
                : currency === 'USD'
                ? `${price['Libras']} Libras`
                : `${price['EUR']} EUR`;
        } else {
            return currency === 'EUR'
                ? `${price['Libras']} Libras`
                : currency === 'USD'
                ? `${price['EUR']} EUR`
                : `${price['USD']} USD`;
        }
    };

    return (
        <GenericScreen showArrow={true} title='Refrescos'>
            <View style={styles.body} testID="product">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        {items.map(item => (
                            <ItemCard
                                key={item.id}
                                id={item.id}
                                title={item.name}
                                price={item.price}
                                stock={item.stock}
                                selected={selectedId === item.id}
                                onPress={() => handleSelectItem(item.id)}
                            />
                        ))}
                    </View>
                </ScrollView>

                {finalPrice[currency] > 0 && (
                    <Footer>
                        <View style={styles.footerButton}>
                            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate(ROUTES.SCREEN_CART, { ratio: getRatio(value) })}>
                                <Text style={styles.payText}>
                                    PAGAR <Text style={FONTS.regularBold}>{price[currency].toFixed(2)}</Text> {currency}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.dropdownContainerWrapper}>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    onChangeValue={calculatePrice}
                                    items={saleType}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setSaleType}
                                    style={styles.dropdownContainer}
                                    textStyle={FONTS.regular}
                                    labelStyle={styles.dropdownLabel}
                                    listItemContainerStyle={styles.listItemContainer}
                                    listItemLabelStyle={FONTS.regular}
                                    ArrowDownIconComponent={() => <Ionicons name='chevron-down' size={18} color={COLORS.white} />}
                                    ArrowUpIconComponent={() => <Ionicons name='chevron-up' size={18} color={COLORS.white} />}
                                />
                            </View>
                        </View>

                        <View style={styles.currencyInfo}>
                            <TouchableOpacity style={styles.currencyButtonLeft} onPress={() => changeCurrency('first')}>
                                <Text style={FONTS.regular}>{getCurrencyValue('first')}</Text>
                            </TouchableOpacity>

                            <Text style={styles.currencyDivider}>|</Text>

                            <TouchableOpacity style={styles.currencyButtonRight} onPress={() => changeCurrency('second')}>
                                <Text style={FONTS.regular}>{getCurrencyValue('second')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Footer>
                )}
            </View>
        </GenericScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 2,
        paddingHorizontal: 6,
    },
    body: {
        flex: 1,
        backgroundColor: COLORS.greyLight,
        paddingTop: 6,
    },
    footerButton: {
        paddingTop: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
    },
    addButton: {
        flexBasis: '60%',
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        maxHeight: 57,
    },
    payText: {
        color: COLORS.white,
        fontSize: scaleSize(14),
    },
    dropdownContainerWrapper: {
        flexBasis: '35%',
        backgroundColor: COLORS.secondary,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderRadius: SIZES.radius,
    },
    dropdownContainer: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        minHeight: 57,
        borderWidth: 0,
        backgroundColor: COLORS.secondary,
    },
    dropdownLabel: {
        fontSize: scaleSize(14),
        color: COLORS.white,
    },
    listItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.greyLight,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    currencyInfo: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '60%',
    },
    currencyButtonLeft: {
        padding: 6,
        width: '80%',
        alignItems: 'flex-end',
    },
    currencyButtonRight: {
        padding: 6,
        width: '80%',
        alignItems: 'flex-start',
    },
    currencyDivider: {
        fontSize: scaleSize(22),
        fontWeight: '200',
    },
});
