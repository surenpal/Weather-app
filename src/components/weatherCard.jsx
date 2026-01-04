import React from 'react'

export const WeatherCard = ({ weather }) => {
  return (
        <div className='mt-6'>
        <h2 className='text-2xl font-semi-cold text-center'>{weather.name}, {weather.sys.country}</h2>
        <div className=' flex justify-center items-center mt-4'>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} 
            className='w-16 h-16'/>
            <p className=' 4xl font-bold'>
                {Math.round(weather.main.temp)}°C
            </p>
        </div>

            <p className='text-center text-gray-400 capitalize'> 
                {weather.weather[0].description}
            </p>
            <div>
                <div>
                    <p>Humidity</p>
                    <p>{weather.main.humidity}%</p>
                </div>
                 <div>
                    <p>Wind speed</p>
                    <p>{weather.wind.speed} m/s</p>
                </div>
                <div>
                    <p>Feels Like</p>
                    <p>{Math.round(weather.main.feels_like)}°C</p>
                </div>
            </div>
        </div>
  )
}
