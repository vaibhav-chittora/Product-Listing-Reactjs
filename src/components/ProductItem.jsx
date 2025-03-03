import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Trash2, Percent, GripVertical, IndianRupee } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { searchProducts } from '../api/productsApi';
import VariantsAccordion from './VariantsAccordion';

const ProductItem = ({ product, index, onOpenModal }) => {
    const { removeProduct, updateProduct, moveProduct, applyDiscount } = useProducts();
    const ref = useRef(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('flat');
    const [discountValue, setDiscountValue] = useState(0);
    const [variants, setVariants] = useState([]);

    const [{ isDragging }, drag] = useDrag({
        type: 'PRODUCT',
        item: { index, id: product.id, type: 'PRODUCT' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'PRODUCT',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveProduct(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const handleNameChange = (e) => {
        updateProduct(product.id, { name: e.target.value });
    };

    const handlePriceChange = (e) => {
        const price = parseFloat(e.target.value);
        if (!isNaN(price)) {
            updateProduct(product.id, { price });
        }
    };

    const handleApplyDiscount = () => {
        const value = parseFloat(discountValue);
        if (!isNaN(value) && value > 0) {
            applyDiscount(product.id, discountType, value);
            setIsApplyingDiscount(false);
        }
    };

    const calculateFinalPrice = () => {
        if (!product.discount) return product.price;

        if (product.discount.type === 'flat') {
            return Math.max(0, product.price - product.discount.value);
        } else {
            return product.price * (1 - product.discount.value / 100);
        }
    };


    const handleShowVariants = async () => {
        const variants = await searchProducts(product.title, 1, 10);
        console.log('Variants:', variants);
        setVariants(variants);
        // onOpenModal();

    };

    return (
        <div
            ref={ref}
            className={`bg-white rounded-lg shadow-md p-4 mb-4 flex items-start gap-4 ${isDragging ? 'opacity-50' : 'opacity-100'
                }`}
        >
            <div className="cursor-move flex items-center h-full pt-2">
                <GripVertical size={20} className="text-gray-400" />
            </div>

            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img
                    src={product.image}
                    alt={`No Image available`}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-grow">
                {isEditingName ? (
                    <input
                        type="text"
                        value={product.title}
                        onChange={handleNameChange}
                        onBlur={() => setIsEditingName(false)}
                        autoFocus
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Product name"
                    />
                ) : (
                    <div
                        className="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => setIsEditingName(true)}
                    >
                        {product.title}
                    </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                    {isEditingPrice ? (
                        <input
                            type="number"
                            value={product.price}
                            onChange={handlePriceChange}
                            onBlur={() => setIsEditingPrice(false)}
                            autoFocus
                            className="w-32 p-2 border rounded"
                            min="0"
                            step="0.01"
                        />
                    ) : (
                        <div
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => setIsEditingPrice(true)}
                        >
                            {/* ${product.toFixed(2)} */}
                        </div>
                    )}

                    {product.discount && (
                        <div className=" bg-green-100 text-green-800 px-2 py-1 rounded text-l">
                            {product.discount.type === 'flat'
                                ? `₹${product.discount.value.toFixed(2)} discount`
                                : `${product.discount.value}% off`}
                        </div>
                    )}

                    {/* {product.discount && (
                        // <div className="text-sm font-semibold">
                        //     = ₹{calculateFinalPrice()}
                        // </div>
                    )} */}
                </div>

                {isApplyingDiscount && (
                    <div className="flex items-center gap-2 mb-3">
                        <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="flat">Flat (₹)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>
                        <input
                            type="phone"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            className="w-20 p-2 border rounded"
                            min="0"
                            step={discountType === 'flat'}
                        />
                        <button
                            onClick={handleApplyDiscount}
                            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 cursor-pointer "
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => setIsApplyingDiscount(false)}
                            className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {/* <button
                    onClick={() => onOpenModal(product.id)}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    title="Replace product"
                >
                    <RefreshCw size={18} />
                </button> */}
                <button
                    onClick={() => setIsApplyingDiscount(true)}
                    className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                    title="Apply discount"
                >
                    {discountType === 'flat' ? <IndianRupee size={18} /> : <Percent size={18} />}
                </button>
                <button
                    onClick={() => removeProduct(product.id)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    title="Remove product"
                >
                    <Trash2 size={18} />
                </button>

                {/* button to show variants */}
                {/* <button
                    onClick={handleShowVariants}
                    className='p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200'
                    title='Show Variants'
                >
                    <SquareArrowDown size={18} />
                </button> */}
                {variants.length > 0 || <VariantsAccordion productTitle={product.title} />}

            </div>
        </div>
    );
};

export default ProductItem;