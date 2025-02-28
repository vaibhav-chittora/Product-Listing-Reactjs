import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Loader } from 'lucide-react';
import { searchProducts } from '../api/productsApi';
import { useProducts } from '../context/ProductsContext';
import { useQuery } from '@tanstack/react-query';

const ProductPickerModal = ({ isOpen, onClose, selectedProductId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [allProducts, setAllProducts] = useState([]);
    const { replaceProduct } = useProducts();
    const observerRef = useRef(null);
    const containerRef = useRef(null);

    const { data, isLoading, isFetching, error } = useQuery({

        queryKey: ['products', searchTerm, page],
        queryFn: () => searchProducts(searchTerm, page, 10),
        keepPreviousData: true,
    });

    useEffect(() => {
        if (data && !isFetching) {
            if (page === 1) {
                setAllProducts(data.data);
            } else {
                setAllProducts(prev => [...prev, ...data.data]);
            }
        }
    }, [data, isFetching, page]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
        setAllProducts([]);
    };

    const handleSelectProduct = (product) => {
        replaceProduct(selectedProductId, product);
        onClose();
    };

    const lastProductElementRef = useCallback(node => {
        if (isLoading || isFetching) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && data && data.page * data.limit < data.total) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [isLoading, isFetching, data]);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setPage(1);
            setAllProducts([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                ref={containerRef}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Select a Product</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search products..."
                            className="w-full p-2 pl-10 border rounded-lg"
                            autoFocus
                        />
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow p-4">
                    {error ? (
                        <div className="text-center py-8 text-red-500">
                            Error loading products. Please try again.
                        </div>
                    ) : allProducts.length === 0 && !isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            No products found. Try a different search term.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {allProducts.map((product, index) => {
                                if (allProducts.length === index + 1) {
                                    return (
                                        <div
                                            key={product._id}
                                            ref={lastProductElementRef}
                                            className="border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50"
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-gray-600">${product.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            key={product._id}
                                            className="border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50"
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-gray-600">${product.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}

                    {(isLoading || isFetching) && (
                        <div className="flex justify-center items-center py-4">
                            <Loader size={24} className="animate-spin text-blue-500" />
                            <span className="ml-2 text-gray-600">Loading more products...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPickerModal;