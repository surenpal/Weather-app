import React from "react";

export const ForecastCard = ({ item }) => {
  const date = new Date(item.dt * 1000);
  const dayName = date.toLocaleDateString(undefined, { weekday: "short" });
  const temp = Math.round(item.main.temp);
  const icon = item.weather[0].icon;
  const desc = item.weather[0].description;

  return (
    <div
      className="flex flex-col items-center p-3 rounded-lg bg-black/30 
                 border border-white/20 text-xs"
    >
      <p className="font-semibold mb-1">{dayName}</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}.png`}
        alt={desc}
        className="w-10 h-10"
      />
      <p className="mt-1 font-bold">{temp}°C</p>
      <p className="mt-1 text-[0.7rem] text-gray-200 capitalize text-center">
        {desc}
      </p>
    </div>
  );
};