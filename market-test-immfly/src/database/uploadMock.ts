import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';


const clearProducts = async () => {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    const promises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'products', docSnap.id)));
    await Promise.all(promises);
};

const generateRandomProduct = (i: number) => {
    const name = 'Cocacola';
    const stock = Math.floor(Math.random() * 16); // Stock between 0 et 15
    const priceEUR = (Math.random() * 4 + 1).toFixed(2); // Price between 1 and 5 EUR
    const priceUSD = (parseFloat(priceEUR) * 1.17).toFixed(2);
    const priceGBP = (parseFloat(priceEUR) * 0.87).toFixed(2);

    return {
        id: i,
        name,
        stock,
        price: {
            EUR: parseFloat(priceEUR),
            USD: parseFloat(priceUSD),
            Libras: parseFloat(priceGBP),
        },
    };
};

export const uploadRandomProducts = async () => {
    await clearProducts();

    const productsRef = collection(db, 'products');
    const numProducts = Math.floor(Math.random() * 14) + 7; // Between 7 and 20 products
    const products = [];

    for (let i = 0; i < numProducts; i++) {
        const product = generateRandomProduct(i);
        products.push(product);
        await addDoc(productsRef, product);
  }
};
