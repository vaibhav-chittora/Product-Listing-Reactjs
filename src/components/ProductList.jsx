import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductItem from './ProductItem';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../api/productsApi';
import { Loader } from 'lucide-react';

const ProductList = ({ onOpenModal }) => {
    const { products, setProducts } = useProducts();
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['products', page, limit],
        queryFn: () => searchProducts('', page, limit),
        keepPreviousData: true,  // Ye previous data ko retain karega taaki transition smooth ho
    });

    // 🛠 Update products when new data is fetched
    useEffect(() => {
        if (data) {
            setProducts(data);
        }
    }, [data, setProducts]);

    return (
        <div className="space-y-4">
            {isLoading ? (
                // <p className="text-center py-8">Loading products...</p>
                <Loader className="mx-auto animate-spin" />
            ) : isError ? (
                <p className="text-center py-8 text-red-500">{error.message}</p>
            ) : products.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No products found.</p>
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

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={() => setPage(prevPage => Math.max(1, prevPage - 1))}
                    disabled={page === 1}
                    className={`px-4 cursor-pointer py-2 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage(prevPage => prevPage + 1)}
                    className="px-4 cursor-pointer py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;
