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

  // ✅ FIXED forecast (no duplicate days)
  const extractDailyForecast = (list) => {
    const dailyMap = {};

    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const key = date.toLocaleDateString();

      if (!dailyMap[key] && item.dt_txt.includes("12:00:00")) {
        dailyMap[key] = item;
      }
    });

    // fallback
    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const key = date.toLocaleDateString();

      if (!dailyMap[key]) {
        dailyMap[key] = item;
      }
    });

    return Object.values(dailyMap)
      .sort((a, b) => a.dt - b.dt)
      .slice(0, 5);
  };

  // ✅ FIXED error handler
  const handleAxiosError = (error) => {
    console.error(error);

    if (error?.response) {
      if (error.response.status === 404) {
        setError("City not found.");
      } else {
        setError("Failed to fetch weather data.");
      }
    } else {
      setError("Network error.");
    }
  };

  const fetchWeatherByCity = async (city) => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const weatherRes = await axios.get(
        `${WEATHER_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(weatherRes.data);

      const forecastRes = await axios.get(
        `${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );
      setForecast(extractDailyForecast(forecastRes.data.list));
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      const weatherRes = await axios.get(
        `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeather(weatherRes.data);

      const forecastRes = await axios.get(
        `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setForecast(extractDailyForecast(forecastRes.data.list));
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => setError("Location access denied.")
    );
  };

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  // ✅ RETURN IS NOW CORRECTLY INSIDE FUNCTION
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex items-center justify-center bg-pink-200 dark:bg-black relative px-4">

        {/* overlay */}
        <div className="absolute inset-0 bg-pink-300/30 dark:bg-black/50"></div>

        {/* glass card */}
        <div className="relative z-10 backdrop-blur-md bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl shadow-xl p-8 max-w-md w-full">

          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">Weather App</h1>

            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="px-3 py-1 text-sm rounded bg-black/30 text-white"
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