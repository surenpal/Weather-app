import React, { useState } from 'react'

export const SearchBar = () => {

    const [city, setCity] = useState ("")

  return (
    <form>
        <input type="text" placeholder='Enter city name' value={city}
        onChange={(e) => setCity = (e.target.value)}
        className='p-2 border border-gray-300 rounded-lg outline none'/>
    </form>
  )
}


export default SearchBar