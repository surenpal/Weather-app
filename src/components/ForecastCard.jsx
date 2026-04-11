export const ForecastCard = ({ item, unit }) => {
  const date = new Date(item.dt * 1000);
  const dayName = date.toLocaleDateString(undefined, { weekday: "short" });
  const temp = Math.round(item.main.temp);
  const tempMin = Math.round(item.main.temp_min);
  const tempMax = Math.round(item.main.temp_max);
  const icon = item.weather[0].icon;
  const desc = item.weather[0].description;
  const tempUnit = unit === "metric" ? "°C" : "°F";

  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 text-xs min-w-[80px] flex-shrink-0">
      <p className="font-semibold uppercase tracking-wide text-[0.65rem] opacity-70">
        {dayName}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={desc}
        className="w-12 h-12"
      />
      <p className="font-bold text-sm">{temp}{tempUnit}</p>
      <p className="text-[0.65rem] opacity-60 mt-0.5">
        ↑{tempMax} ↓{tempMin}
      </p>
    </div>
  );
};
