import { useProducts } from "../context/ProductsContext"

const ProductList = () => {

    const { products } = useProducts()
    return (
        <div>
            {products.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No products added yet. Click the "Add Product" button to get started.</p>
                </div>) : (
                products.map((product, index) => {
                    return (
                        <div>
                            <p>{product.name}</p>
                            <p>{product.price}</p>
                            <p>{product.description}</p>
                        </div>
                    )
                })
            )
            }
        </div>
    )
}

export default ProductList