import React, { useState } from "react"
import './index.css'
import { SearchBar } from "./components/SearchBar"
import { compile } from "tailwindcss";
import axios from "axios";

function App () {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY
  const API_URL = "https://api.openweathermap.org/data/2.5/weather"



  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const url =`${API_URL}?q=${city}&units=metric&appid=${API_KEY}`;


      const response = await axios.get(url) 
      console.log(response.data)

      setWeather(response.data)
    }
    catch (error){
    if (error.response && error.response.status === 404) {
      setError('City not found');
    } else {
      setError('Failed to fetch weather data');
    }
    setWeather(null);
  }

  }

  return (
    <div className = "min-h-screen flex flex-col items-center justify-center bg-blue-100" >
      <div className="bg-black/90 text-white rounded-lg shadow-lg p-8 max-w-md w-full"><h1 className = "text-3xl font-bold text-center mb-6">Weather-App</h1>
      <SearchBar fetchWeather= {fetchWeather}/>
      </div>
    </div>
  )
}

export default App
