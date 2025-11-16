// import { useEffect, useState } from 'react'
import { NavBar } from './components/navbar'
import { SearchBox } from './components/search_box'

function App() {

  return (
    <>
      <div id='app'>
        <div id="appComponents">
          <div className="compartment compartment-1">
            <NavBar />
            <SearchBox />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
