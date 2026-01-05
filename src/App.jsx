import React, { useState } from "react"
import './index.css'
import { SearchBar } from "./components/SearchBar"
import { WeatherCard } from "./components/weatherCard"
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
      setError('City not found,Please check again');
    } else {
      setError('Failed to fetch weather data, pls try again later.');
    }
    setWeather(null);
  } finally {
    setLoading(false)
  }

  }

  return (
    <div className = "min-h-screen flex flex-col items-center justify-center bg-blue-100 relative overflow-hidden" >
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/bg_video.mp4"
        type="video/mp4"/>
      <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10"></div>
      <div className="bg-black/65 text-white rounded-lg shadow-lg p-8 max-w-md w-full  z-10">
      <h1 className = "text-3xl font-bold text-center mb-6">Weather-App-Suren</h1>
      <SearchBar fetchWeather= {fetchWeather}/>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  )
} 

export default App
