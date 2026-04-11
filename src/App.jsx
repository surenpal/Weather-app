import { useState, useEffect } from "react";
import "./index.css";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/weatherCard";
import { ForecastCard } from "./components/ForecastCard";
import { WeatherSkeleton } from "./components/WeatherSkeleton";
import axios from "axios";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";
import { MdMyLocation } from "react-icons/md";
import { WiDayCloudy } from "react-icons/wi";

const getBackground = (condition, isNight) => {
  if (isNight) return "linear-gradient(135deg, #0f0c29, #302b63, #24243e)";
  switch (condition) {
    case "Clear":       return "linear-gradient(135deg, #f7971e, #ffd200)";
    case "Clouds":      return "linear-gradient(135deg, #757f9a, #d7dde8)";
    case "Rain":
    case "Drizzle":     return "linear-gradient(135deg, #4b79a1, #283e51)";
    case "Thunderstorm":return "linear-gradient(135deg, #373b44, #4286f4)";
    case "Snow":        return "linear-gradient(135deg, #accbee, #e7f0fd)";
    default:            return "linear-gradient(135deg, #667eea, #764ba2)";
  }
};

function App() {
  const [weather, setWeather]   = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit]         = useState("metric"); // "metric" | "imperial"

  const API_KEY     = import.meta.env.VITE_API_KEY;
  const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
  const FORECAST_URL= "https://api.openweathermap.org/data/2.5/forecast";
  const GEO_URL     = "https://api.openweathermap.org/geo/1.0/direct";

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  // Re-fetch with new unit when toggled, if data already loaded
  useEffect(() => {
    if (weather) {
      const { lat, lon } = weather.coord;
      fetchWeatherByCoords(lat, lon);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  // Auto-load last location on mount
  useEffect(() => {
    const saved = localStorage.getItem("weather-last-coords");
    if (saved) {
      const { lat, lon } = JSON.parse(saved);
      fetchWeatherByCoords(lat, lon);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extractDailyForecast = (list) => {
    const map = {};
    list.forEach((item) => {
      const key = new Date(item.dt * 1000).toLocaleDateString();
      if (!map[key] && item.dt_txt.includes("12:00:00")) map[key] = item;
    });
    list.forEach((item) => {
      const key = new Date(item.dt * 1000).toLocaleDateString();
      if (!map[key]) map[key] = item;
    });
    return Object.values(map).sort((a, b) => a.dt - b.dt).slice(0, 5);
  };

  const handleAxiosError = (err) => {
    if (err?.response?.status === 404) setError("City not found.");
    else setError("Failed to fetch weather.");
  };

  const fetchWeatherByCity = async (city) => {
    if (!city.trim()) { setError("Please enter a city name."); return; }
    setLoading(true); setError("");
    try {
      const w = await axios.get(`${WEATHER_URL}?q=${city}&units=${unit}&appid=${API_KEY}`);
      setWeather(w.data);
      localStorage.setItem("weather-last-coords", JSON.stringify({ lat: w.data.coord.lat, lon: w.data.coord.lon }));
      const f = await axios.get(`${FORECAST_URL}?q=${city}&units=${unit}&appid=${API_KEY}`);
      setForecast(extractDailyForecast(f.data.list));
    } catch (err) { handleAxiosError(err); }
    finally { setLoading(false); }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true); setError("");
    try {
      const w = await axios.get(`${WEATHER_URL}?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`);
      setWeather(w.data);
      localStorage.setItem("weather-last-coords", JSON.stringify({ lat, lon }));
      const f = await axios.get(`${FORECAST_URL}?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`);
      setForecast(extractDailyForecast(f.data.list));
    } catch (err) { handleAxiosError(err); }
    finally { setLoading(false); }
  };

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeatherByCoords(coords.latitude, coords.longitude),
      () => setError("Unable to access your location.")
    );
  };

  const now = Date.now() / 1000;
  const isNight = weather
    ? now > weather.sys.sunset || now < weather.sys.sunrise
    : false;

  const bgStyle = weather
    ? { background: getBackground(weather.weather[0].main, isNight) }
    : {};

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4 transition-all duration-700"
      style={{ background: "linear-gradient(135deg, #38bdf8, #2563eb)", ...bgStyle }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />

      {/* glass card */}
      <div className="relative z-10 backdrop-blur-md bg-white/20 dark:bg-gray-900/50 border border-white/30 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-1.5">
            <WiDayCloudy className="text-4xl text-white drop-shadow" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">
              Sky<span className="font-light">cast</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">

            {/* °C / °F segmented toggle */}
            <div className="flex rounded-lg overflow-hidden bg-white/10 text-sm font-bold">
              <button
                onClick={() => setUnit("metric")}
                className={`px-3 py-1.5 transition ${unit === "metric" ? "bg-white/40" : "hover:bg-white/20"}`}
              >°C</button>
              <button
                onClick={() => setUnit("imperial")}
                className={`px-3 py-1.5 transition ${unit === "imperial" ? "bg-white/40" : "hover:bg-white/20"}`}
              >°F</button>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-lg bg-white/25 dark:bg-white/10 hover:bg-white/40 transition text-base"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <BsSun /> : <BsMoonStarsFill />}
            </button>
          </div>
        </div>

        <SearchBar
          fetchWeather={fetchWeatherByCity}
          fetchWeatherByCoords={fetchWeatherByCoords}
          apiKey={API_KEY}
          geoUrl={GEO_URL}
        />

        <button
          onClick={handleUseMyLocation}
          className="w-full mt-3 p-2 rounded-lg bg-teal-500/80 hover:bg-teal-500 text-white font-medium flex items-center justify-center gap-2 transition"
        >
          <MdMyLocation className="text-lg" />
          Use My Location
        </button>

        {loading && <WeatherSkeleton />}

        {error && !loading && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/20 border border-red-400/50 text-red-100 text-center text-sm">
            {error}
          </div>
        )}

        {!loading && weather && <WeatherCard weather={weather} unit={unit} />}

        {!loading && forecast.length > 0 && (
          <div className="mt-6">
            <h3 className="text-center font-semibold mb-3 text-xs uppercase tracking-widest opacity-60">
              5-Day Forecast
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {forecast.map((item) => (
                <ForecastCard key={item.dt} item={item} unit={unit} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
