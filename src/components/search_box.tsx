import { useState, useRef, useEffect } from 'react'
import { useGlobal } from '../utils/global_context'
import iconSearch from '../assets/icon-search.svg'
import iconLoading from '../assets/icon-loading.svg'

type Place = {
    place_id?: number
    display_name: string
    lat?: string
    lon?: string
    name?: string
    latitude?: string | number
    longitude?: string | number
}

type SearchBoxProps = {
    onSearch?: (place: Place | string) => void
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
    // const { setLocationId, setLocationName, setLocationLattitude, setLocationLongitude } = useGlobal();
    
    

    return (
        <>
            <div id="searchContainer">
                <div className="search-container-parent">
                    <div className="heading-container">
                        <p id="heading">How's the sky looking today?</p>
                    </div>
                    <div className="search-box-container">
                        
                    </div>
                </div>
            </div>
        </>
    )
}