import { useState } from 'react'
import ThreeScene from './ThreeScene'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <ThreeScene />
    </>
  )
}

export default App
