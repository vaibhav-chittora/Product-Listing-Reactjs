import { useEffect } from 'react'
import './App.css'
import { searchProducts } from './api/productsApi'
import ProductList from './components/ProductList'

function App() {
  useEffect(() => {
    searchProducts()
  })

  return (
    <>
      <h1>Ecommerce Project</h1>
      <ProductList />
    </>
  )
}

export default App
