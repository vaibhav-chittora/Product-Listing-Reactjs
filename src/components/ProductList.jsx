import React from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductItem from './ProductItem';

const ProductList = ({ onOpenModal }) => {
    const { products } = useProducts();

    return (
        <div className="space-y-4">
            {products.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No products added yet. Click the "Add Product" button to get started.</p>
                </div>
            ) : (
                products.map((product, index) => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        index={index}
                        onOpenModal={onOpenModal}
                    />
                ))
            )}
        </div>
    );
};

export default ProductList;