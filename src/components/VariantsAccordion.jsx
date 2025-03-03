import React, { useState } from "react";
import { searchProducts } from "../api/productsApi";

const VariantsAccordion = ({ productTitle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [variants, setVariants] = useState([]);

    const handleToggleAccordion = async () => {
        setIsOpen(!isOpen);

        if (!isOpen && variants.length === 0) {
            try {
                const response = await searchProducts(productTitle, 1, 10);
                if (response.length > 0 && response[0].variants) {
                    setVariants(response[0].variants);
                } else {
                    setVariants([]);
                }
            } catch (error) {
                console.error("Error fetching variants:", error);
                setVariants([]);
            }
        }
    };

    return (
        <div className="border rounded-md p-2 mt-2">
            <button
                className="w-full text-left font-semibold text-blue-600 flex justify-between items-center"
                onClick={handleToggleAccordion}
            >
                Variants
                <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <div className="mt-2 p-2 border-t">
                    {variants.length > 0 ? (
                        <ul>
                            {variants.map((variant) => (
                                <li key={variant.id} className="p-1 border-b">
                                    {variant.title} - ₹{variant.price}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No variants available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VariantsAccordion;
