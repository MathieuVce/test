import React, { useContext, useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard';
import { Ionicons } from '@expo/vector-icons';
import GenericScreen from '@/components/GenericScreen';
import DropDownPicker from 'react-native-dropdown-picker';
import { AppModelNavProps } from '@/roots/AppModelNavigator';
import { OptionValue, OPTIONS, IPrice } from '@/@types/IMarketContext';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MarketContext } from '@/contexts/MarketContext';
import { ROUTES } from '@/@types/staticKeys';

type TProductsProps = AppModelNavProps<'Products'>;

export const Products: React.FC<TProductsProps> = ({ navigation }) => {
    const { currency, setCurrency, items, getItems, finalPrice } = useContext(MarketContext);

    const [price, setPrice] = useState<IPrice>({ EUR: 0, USD: 0, Libras: 0 });
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<OptionValue['label']>(OPTIONS.RETAIL.label);

    const [saleType, setSaleType] = useState<{ label: OptionValue['label']; value: OptionValue['label'] }[]>(
        Object.values(OPTIONS).map((opt) => ({
            label: opt.label,
            value: opt.label,
        }))
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
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
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
                <View style={styles.footer}>
                    <View style={styles.footerButton}>
                        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate(ROUTES.SCREEN_CART)}>
                            <Text style={styles.payText}>
                                PAGAR <Text style={styles.price}>{price[currency].toFixed(2)}</Text> {currency}
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
                                textStyle={styles.dropdownText}
                                labelStyle={styles.dropdownLabel}
                                listItemContainerStyle={styles.listItemContainer}
                                listItemLabelStyle={styles.listItemLabel}
                                ArrowDownIconComponent={() => <Ionicons name='chevron-down' size={18} color='white' />}
                                ArrowUpIconComponent={() => <Ionicons name='chevron-up' size={18} color='white' />}
                            />
                        </View>
                    </View>

                    <View style={styles.currencyInfo}>
                        <TouchableOpacity style={styles.currencyButton} onPress={() => changeCurrency('first')}>
                            <Text style={styles.currencyText}>{getCurrencyValue('first')}</Text>
                        </TouchableOpacity>

                        <Text style={styles.currencyDivider}>|</Text>

                        <TouchableOpacity style={styles.currencyButton} onPress={() => changeCurrency('second')}>
                            <Text style={styles.currencyText}>{getCurrencyValue('second')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    },
    footer: {
        paddingTop: 24,
        alignItems: 'center',
        backgroundColor: 'white',
        minHeight: 138,
        marginBottom: 20,
    },
    footerButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
    },
    addButton: {
        flexBasis: '60%',
        backgroundColor: '#3d38f5',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        maxHeight: 57,
    },
    payText: {
        color: 'white',
        fontSize: 16,
    },
    price: {
        fontWeight: 'bold',
    },
    dropdownContainerWrapper: {
        flexBasis: '35%',
        backgroundColor: '#1e1c7a',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderRadius: 10,
    },
    dropdownContainer: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        minHeight: 57,
        borderWidth: 0,
        backgroundColor: '#1e1c7a',
    },
    dropdownText: {
        fontSize: 16,
        color: 'black',
    },
    dropdownLabel: {
        fontSize: 14,
        color: 'white',
    },
    listItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    listItemLabel: {
        fontSize: 14,
        color: 'black',
    },
    currencyInfo: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '40%',
    },
    currencyButton: {
        padding: 6,
        width: '50%',
        alignItems: 'center',
    },
    currencyDivider: {
        fontSize: 22,
    },
    currencyText: {
        fontSize: 14,
        color: 'black',
    },
});
