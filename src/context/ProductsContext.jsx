import { createContext, useState } from "react";

const ProductsContext = createContext();

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