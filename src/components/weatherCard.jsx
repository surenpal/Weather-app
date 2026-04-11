import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiThermometer,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";

const getWindDir = (deg) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

export const WeatherCard = ({ weather, unit }) => {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  const formatTime = (unix) =>
    new Date(unix * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const stats = [
    {
      label: "Humidity",
      value: `${weather.main.humidity}%`,
      icon: <WiHumidity className="text-2xl" />,
    },
    {
      label: "Wind",
      value: `${weather.wind.speed} ${windUnit} · ${getWindDir(weather.wind.deg)}`,
      icon: <WiStrongWind className="text-2xl" />,
    },
    {
      label: "Pressure",
      value: `${weather.main.pressure} hPa`,
      icon: <WiBarometer className="text-2xl" />,
    },
    {
      label: "Feels Like",
      value: `${Math.round(weather.main.feels_like)}${tempUnit}`,
      icon: <WiThermometer className="text-2xl" />,
    },
    {
      label: "Sunrise",
      value: formatTime(weather.sys.sunrise),
      icon: <WiSunrise className="text-2xl" />,
    },
    {
      label: "Sunset",
      value: formatTime(weather.sys.sunset),
      icon: <WiSunset className="text-2xl" />,
    },
  ];

  return (
    <div className="mt-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-center">
        {weather.name}, {weather.sys.country}
      </h2>

      <div className="flex justify-center items-center mt-4">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="w-20 h-20"
        />
        <p className="text-6xl font-bold ml-2">
          {Math.round(weather.main.temp)}{tempUnit}
        </p>
      </div>

      <p className="text-center capitalize mt-1 opacity-80 text-sm">
        {weather.weather[0].description}
      </p>

      <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
        {stats.map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-white/10 dark:bg-white/5 rounded-xl px-3 py-2"
          >
            <span className="opacity-60">{icon}</span>
            <div>
              <p className="text-xs opacity-60">{label}</p>
              <p className="font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
