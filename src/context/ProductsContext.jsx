import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

    const addProduct = () => {
        const newProduct = {
            id: uuidv4(),
            name: '',
            price: 0,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        };
        setProducts([...products, newProduct]);
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