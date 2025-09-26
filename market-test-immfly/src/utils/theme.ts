import { Dimensions, TextStyle } from 'react-native';
import { moderateScale } from './global';

// Global colors
type Neutral =
 | 'primary'
 | 'secondary'
 | 'lightPrimary'
 | 'white'
 | 'black'
 | 'red'
 | 'greyLight'
 | 'extraLightGrey'
 | 'darkLightOpacity'
 | 'darkOpacity'
 | 'lightSteelBlue'
 | 'purple'
 | 'lightGrey'
 | 'grey';

export const COLORS: Record<Neutral, string> = {
    primary: '#3d38f5',
    secondary: '#1e1c7a',
    lightPrimary: '#e6e5ff',
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF0000',
    lightGrey: '#d3d3d3',
    greyLight: '#e0e0e0',
    extraLightGrey: '#f0f0f0',
    darkLightOpacity: 'rgba(0,0,0,0.2)',
    darkOpacity: 'rgba(0,0,0,0.5)',
    lightSteelBlue: '#9eb8c0',
    purple: '#65638e',
    grey: '#808080',
};

// Global sizes
const { width, height } = Dimensions.get('window');

export const SIZES = {
    width,
    height,
    radius: 10,
    font: moderateScale(14),
};

// Typographic styles

export const FONTS: Record<string, TextStyle> = {
    regular: { fontSize: SIZES.font },
    regularBold: { fontSize: SIZES.font, fontWeight: 'bold' },
    h1: { fontSize: SIZES.font * 2, fontWeight: 'bold' },
    h2: { fontSize: SIZES.font * 1.5, fontWeight: 'bold' },
};
