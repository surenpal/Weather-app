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

  const fetchWeatherByCity = async (city) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const weatherUrl = `${WEATHER_URL}?q=${trimmedCity}&units=metric&appid=${API_KEY}`;
      const weatherRes = await axios.get(weatherUrl);
      setWeather(weatherRes.data);

      const forecastUrl = `${FORECAST_URL}?q=${trimmedCity}&units=metric&appid=${API_KEY}`;
      const forecastRes = await axios.get(forecastUrl);
      const daily = extractDailyForecast(forecastRes.data.list);
      setForecast(daily);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const weatherUrl = `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const weatherRes = await axios.get(weatherUrl);
      setWeather(weatherRes.data);

      const forecastUrl = `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const forecastRes = await axios.get(forecastUrl);
      const daily = extractDailyForecast(forecastRes.data.list);
      setForecast(daily);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const extractDailyForecast = (list) => {
    const byDate = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!byDate[date]) {
        byDate[date] = [];
      }
      byDate[date].push(item);
    });

    const daily = Object.keys(byDate).map((date) => {
      const midday =
        byDate[date].find((item) => item.dt_txt.includes("12:00:00")) ||
        byDate[date][0];
      return midday;
    });

    return daily.slice(0, 5);
  };

  const handleAxiosError = (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        setError("City not found. Please check again.");
      } else {
        setError("Failed to fetch weather data. Please try again later.");
      }
    } else {
      setError("Unexpected error occurred.");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        setLoading(false);
        setError("Unable to retrieve your location.");
      }
    );
  };

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-200 dark:bg-gray-900 px-4">
        <div
          className="backdrop-blur-md bg-white/30 dark:bg-gray-800/40 
                     border border-white/40 dark:border-gray-700 
                     text-white rounded-xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Weather App Suren</h1>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="text-sm px-3 py-1 rounded-full border border-white/40 
                         bg-black/30 hover:bg-black/50 transition"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          <SearchBar
            fetchWeather={fetchWeatherByCity}
            apiKey={API_KEY}
            geoUrl={GEO_URL}
          />

          <div className="flex justify-between items-center mt-3 gap-2">
            <button
              onClick={handleUseMyLocation}
              className="w-full text-sm px-3 py-2 rounded-lg border border-white/40 
                         bg-black/30 hover:bg-black/50 transition"
            >
              Use My Location
            </button>
          </div>

          {loading && <p className="text-center mt-4">Loading...</p>}
          {error && <p className="text-center mt-4 text-red-300">{error}</p>}

          {weather && <WeatherCard weather={weather} />}

          {forecast.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-center">
                5-Day Forecast
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
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
