import React, { useState, useEffect } from "react";
import "./index.css";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { ForecastCard } from "./components/ForecastCard";
import axios from "axios";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
  const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

  // ✅ Apply dark mode to <html>
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // ✅ Detect system theme on load
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  // ✅ Forecast fix
  const extractDailyForecast = (list) => {
    const map = {};

    list.forEach((item) => {
      const key = new Date(item.dt * 1000).toLocaleDateString();
      if (!map[key] && item.dt_txt.includes("12:00:00")) {
        map[key] = item;
      }
    });

    list.forEach((item) => {
      const key = new Date(item.dt * 1000).toLocaleDateString();
      if (!map[key]) map[key] = item;
    });

    return Object.values(map)
      .sort((a, b) => a.dt - b.dt)
      .slice(0, 5);
  };

  const handleAxiosError = (error) => {
    if (error?.response?.status === 404) {
      setError("City not found.");
    } else {
      setError("Failed to fetch weather.");
    }
  };

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setError("");

    try {
      const w = await axios.get(
        `${WEATHER_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(w.data);

      const f = await axios.get(
        `${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );
      setForecast(extractDailyForecast(f.data.list));
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeatherByCity(`${pos.coords.latitude},${pos.coords.longitude}`);
    });
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-pink-200 dark:bg-black relative px-4">

        {/* overlay */}
        <div className="absolute inset-0 bg-pink-300/30 dark:bg-black/50"></div>

        {/* glass card */}
        <div className="relative z-10 backdrop-blur-md bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl shadow-xl p-8 max-w-md w-full">

          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">Weather App</h1>

            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="px-3 py-1 rounded bg-black/30 text-white"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          <SearchBar
            fetchWeather={fetchWeatherByCity}
            apiKey={API_KEY}
            geoUrl={GEO_URL}
          />

          <button
            onClick={handleUseMyLocation}
            className="w-full mt-3 p-2 rounded bg-black/30 text-white"
          >
            Use My Location
          </button>

          {loading && <p className="mt-4 text-center">Loading...</p>}
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          {weather && <WeatherCard weather={weather} />}

          {forecast.length > 0 && (
            <div className="mt-6">
              <h3 className="text-center font-semibold mb-2">
                5-Day Forecast
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {forecast.map((item) => (
                  <ForecastCard key={item.dt} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;