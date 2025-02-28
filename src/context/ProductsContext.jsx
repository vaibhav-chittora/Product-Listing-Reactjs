import { createContext, useContext, useState } from "react";

const ProductsContext = createContext();


export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return context;
}

export const ProductsProvider = ({ children }) => {

    const [products, setProducts] = useState([]);

    const addProduct = () => {
        setProducts([...products, product]);
    }

    return (
        <ProductsContext.Provider
            value={{
                products,
                addProduct
            }}
        >
            {children}
        </ProductsContext.Provider>
    )
}