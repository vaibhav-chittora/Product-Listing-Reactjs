import { useState } from 'react'
import './App.css'
import ProductList from './components/ProductList'
import ProductPickerModal from './components/ProductPickerModal'
import { ProductsProvider, useProducts } from './context/ProductsContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Plus, ShoppingBag } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML } from 'react-dnd-html5-backend/dist/NativeTypes'
import { HTML5Backend } from 'react-dnd-html5-backend'


const queryClient = new QueryClient()
function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const { addProduct } = useProducts()

  const handleOpenModal = (productId) => {
    setIsModalOpen(true)
    setSelectedProductId(productId)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProductId(null)
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Product Management</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
            <button
              onClick={addProduct}
              className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>

          <ProductList onOpenModal={handleOpenModal} />
        </div>
      </main>

      <ProductPickerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedProductId={selectedProductId}
      />
    </div>
  )
}



function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <ProductsProvider>
          <AppContent />
        </ProductsProvider>
      </DndProvider>
    </QueryClientProvider>
  )
}

export default App
