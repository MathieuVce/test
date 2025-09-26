import { Dimensions, PixelRatio } from "react-native";

const { width } = Dimensions.get("window");

// Scale text size
export const scaleSize = (size: number) => {
    const fontScale = PixelRatio.getFontScale();
    return size / fontScale;
};

// Moderate scale for better responsiveness
export const moderateScale = (size: number, factor = 0.5) => {
    const newSize = size * (width / 375); // 375 is base width (iPhone 6/7/8)
    return size + (newSize - size) / factor;
};

// Debounce function to limit how often a function can be triggered
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};