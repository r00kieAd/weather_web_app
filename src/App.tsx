// import { useEffect, useState } from 'react'
import { NavBar } from './components/navbar'
import { SearchBox } from './components/search_box'
import Aurora from './components/aurora';

function App() {

  return (
    <>
      <Aurora
        colorStops={["#003161", "#4455da", "#006A67"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.6}
      />
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
