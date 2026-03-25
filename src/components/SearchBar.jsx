import React, { useState, useEffect } from "react";
import axios from "axios";

export const SearchBar = ({ fetchWeather, apiKey, geoUrl }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (city.trim().length > 1) {
        fetchSuggestions(city.trim());
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [city]);

  const fetchSuggestions = async (query) => {
    try {
      const url = `${geoUrl}?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${apiKey}`;
      const res = await axios.get(url);
      setSuggestions(res.data || []);
      setShowDropdown(true);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (city.trim()) {
      fetchWeather(city);
      setCity("");
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (s) => {
    const name = s.state ? `${s.name}, ${s.state}` : s.name;
    setCity(name);
    fetchWeather(name);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <form className="flex" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg border-r-0 
                     outline-none focus:ring-2 focus:ring-blue-400 transition 
                     text-black"
        />

        <button
          className="bg-blue-500 text-white cursor-pointer p-2 hover:bg-blue-600 
                     border border-blue-500 border-l-0 rounded-r-lg transition"
        >
          Search
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 mt-1 bg-white text-black rounded-lg 
                     shadow-lg max-h-60 overflow-y-auto z-30"
        >
          {suggestions.map((s, index) => (
            <li
              key={`${s.lat}-${s.lon}-${index}`}
              onClick={() => handleSelectSuggestion(s)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.name}
              {s.state ? `, ${s.state}` : ""} {s.country && `(${s.country})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};