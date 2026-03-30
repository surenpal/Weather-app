import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export const SearchBar = ({ fetchWeather, apiKey, geoUrl }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef(null);
  const cancelTokenRef = useRef(null);

  // ✅ Debounced suggestion fetch (FIXED)
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = city.trim();

      if (trimmed.length > 1) {
        fetchSuggestions(trimmed);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [city]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    try {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }

      cancelTokenRef.current = axios.CancelToken.source();

      const url = `${geoUrl}?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
      const res = await axios.get(url, {
        cancelToken: cancelTokenRef.current.token,
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setSuggestions(data);
      setShowDropdown(data.length > 0);
      setActiveIndex(-1);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error(err);
        setSuggestions([]);
        setShowDropdown(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim();

    if (trimmed) {
      fetchWeather(trimmed);
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

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form className="flex" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg border-r-0 
                     outline-none focus:ring-2 focus:ring-blue-400 transition 
                     text-gray-800 dark:text-white bg-white dark:bg-gray-800"
        />

        <button
          className="bg-blue-500 text-white cursor-pointer p-2 hover:bg-blue-600 
                     border border-blue-500 border-l-0 rounded-r-lg transition"
        >
          Search
        </button>
      </form>

      {showDropdown && (
        <ul
          className="absolute left-0 right-0 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          {suggestions.length > 0 ? (
            suggestions.map((s, index) => (
              <li
                key={`${s.lat}-${s.lon}`}
                onClick={() => handleSelectSuggestion(s)}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === activeIndex
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                {s.name}
                {s.state ? `, ${s.state}` : ""}{" "}
                {s.country ? `(${s.country})` : ""}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};