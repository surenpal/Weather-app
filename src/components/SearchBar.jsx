import React, { useState } from 'react'

export const SearchBar = () => {

    const [city, setCity] = useState ("")

  return (
    <form className=' flex'>
        <input type="text" placeholder='Enter city name' value={city}
        onChange={(e) => setCity (e.target.value)}
        className='flex-1 p-2 border border-gray-300 rounded-l-lg outline none border-r-0'/>

        <button className= 'bg-blue-500 border cursor-pointer p-2 hover:bg-blue-600  border-l-0 rounded-r-lg' >Search</button>
    </form>
  )
}


export default SearchBar