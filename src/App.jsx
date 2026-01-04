import React from "react"
import './index.css'
import { SearchBar } from "./components/SearchBar"

function App () {


  return (
    <div className = "min-h-screen flex flex-col items-center justify-center bg-blue-100" >
      <div className="bg-black/90 text-white rounded-lg shadow-lg p-8 max-w-md w-full"><h1 className = "text-3xl font-bold text-center mb-6">Weather-App</h1>
      <SearchBar/>
      </div>
    </div>
  )
}

export default App
