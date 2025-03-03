import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { searchProducts } from '../api/productsApi';

const ProductsContext = createContext(undefined);

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const addProduct = async () => {
        const newProduct = await searchProducts('', 1, 10)
        console.log("newProduct data- ", newProduct);
        setProducts(newProduct.map(product => ({ ...product, id: uuidv4() })));
    };

    const removeProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const updateProduct = (id, updatedFields) => {
        setProducts(
            products.map(product =>
                product.id === id ? { ...product, ...updatedFields } : product
            )
        );
    };

    const moveProduct = (dragIndex, hoverIndex) => {
        const draggedProduct = products[dragIndex];
        const newProducts = [...products];
        newProducts.splice(dragIndex, 1);
        newProducts.splice(hoverIndex, 0, draggedProduct);
        setProducts(newProducts);
    };

    const applyDiscount = (id, type, value) => {
        setProducts(
            products.map(product =>
                product.id === id
                    ? { ...product, discount: { type, value } }
                    : product
            )
        );
    };

    const replaceProduct = (id, newProduct) => {
        setProducts(
            products.map(product =>
                product.id === id
                    ? {
                        ...product,
                        name: newProduct.name,
                        price: newProduct.price,
                        image: newProduct.image
                    }
                    : product
            )
        );
    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                addProduct,
                removeProduct,
                updateProduct,
                moveProduct,
                applyDiscount,
                replaceProduct
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};