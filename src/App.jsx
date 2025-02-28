import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
