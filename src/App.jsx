import { useEffect } from 'react'
import './App.css'
import { searchProducts } from './api/productsApi'
import ProductList from './components/ProductList'
import ProductItem from './components/ProductItem'
import ProductPickerModal from './components/ProductPickerModal'

function App() {
  useEffect(() => {
    searchProducts()
  })

  return (
    <>
      <h1>Ecommerce Project</h1>
      <ProductList />
      <ProductItem />
      <ProductPickerModal />
    </>
  )
}

export default App
