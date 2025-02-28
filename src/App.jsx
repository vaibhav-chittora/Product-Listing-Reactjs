import { useEffect } from 'react'
import './App.css'
import { searchProducts } from './api/productsApi'

function App() {
  useEffect(() => {
    searchProducts()
  })

  return (
    <>
      <h1>Ecommerce Project</h1>
    </>
  )
}

export default App
