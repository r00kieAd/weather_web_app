import { useState, useRef, useEffect } from 'react'
import { useGlobal } from '../utils/global_context'
import iconSearch from '../assets/icon-search.svg'
import iconLoading from '../assets/icon-loading.svg'
import initiateSearch from '../services/location_fetcher'
import getWeatherForecast from '../services/get_forecast'
import location_pin from '../assets/location-pin.svg'
import SplitText from './split'

type Place = {
    id: number
    name: string
    country: string
    latitude: number
    longitude: number
    weather_code: number
    is_day: number
}

type SearchBoxProps = {
    onSearch?: (place: Place) => void
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
    const { setLocationId, setLocationName, setLocationCountry, setLocationLattitude, setLocationLongitude, setIsLoading, isLoading } = useGlobal();
    const { setTemperature, setFeelsLike, setHumidity, setWind, setPrecipitation, setCurrWeatherCode, setIsDay } = useGlobal();
    const { setHourlyData } = useGlobal();

    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Place[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [highlight, setHighlight] = useState<number>(-1)
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

    const debounceRef = useRef<number | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        return () => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current)
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (!inputRef.current || !showSuggestions) return

        const updateDropdownPosition = () => {
            const inputRect = inputRef.current!.getBoundingClientRect()
            setDropdownStyle({
                position: 'fixed',
                top: `${inputRect.bottom + 4}px`,
                left: `${inputRect.left}px`,
                width: `${inputRect.width}px`,
                zIndex: 999999,
            })
        }

        updateDropdownPosition()

        window.addEventListener('resize', updateDropdownPosition)
        return () => {
            window.removeEventListener('resize', updateDropdownPosition)
        }
    }, [showSuggestions, suggestions, loading])

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([])
            setShowSuggestions(false)
            setLoading(false)
            return
        }
        if (debounceRef.current) window.clearTimeout(debounceRef.current)

        setLoading(true)
        setShowSuggestions(true)

        debounceRef.current = window.setTimeout(async () => {
            try {
                const result = await initiateSearch({ name: query, count: 5 })

                if (result.status && result.resp && result.resp.results) {
                    const places: Place[] = result.resp.results.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        country: item.country,
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }))
                    setSuggestions(places)
                    setHighlight(-1)
                    setShowSuggestions(true)
                } else {
                    setSuggestions([])
                }
                setLoading(false)
            } catch (error) {
                console.error('Search error:', error)
                setLoading(false)
                setSuggestions([])
            }
        }, 300)
    }, [query])

    const submit = (place: Place) => {
        setShowSuggestions(false)
        setSuggestions([])
        setHighlight(-1)
        setQuery('')
        setLocationId(place.id)
        setLocationName(place.name)
        setLocationCountry(place.country)
        setLocationLattitude(place.latitude)
        setLocationLongitude(place.longitude)
        if (onSearch) onSearch(place);
        weatherForecast(place);
    }

    async function weatherForecast(place: Place) {
        setIsLoading(true);
        try {
            const forecast = await getWeatherForecast({ longitude: String(place.longitude), latitude: String(place.latitude) });
            console.log('Forecast Data:', forecast.resp);
            setTemperature(forecast.resp.current.temperature_2m);
            setFeelsLike(forecast.resp.current.apparent_temperature);
            setHumidity(forecast.resp.current.relative_humidity_2m);
            setWind(forecast.resp.current.wind_speed_10m);
            setPrecipitation(forecast.resp.current.precipitation);
            setIsDay(forecast.resp.current.is_day);
            if (setCurrWeatherCode) setCurrWeatherCode(place.weather_code);
            const hourly_temps = forecast.resp.hourly.temperature_2m;
            const hourly_times = forecast.resp.hourly.time;
            const hourly_codes = forecast.resp.hourly.weather_code;
            const is_day = forecast.resp.hourly.is_day;
            if (setHourlyData) setHourlyData({time: hourly_times, temperature_2m: hourly_temps, iconCode: hourly_codes, is_day: is_day});
        } catch (err) {
            alert('Error while fetching data, please try again');
            console.error(err);
        }
    }

    const onSelectSuggestion = (place: Place) => {
        submit(place)
    }

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!query.trim()) return

        if (highlight >= 0 && suggestions[highlight]) {
            onSelectSuggestion(suggestions[highlight])
            return
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault()
                onFormSubmit(e as any)
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighlight((h) => Math.min(h + 1, suggestions.length - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlight((h) => Math.max(h - 1, -1))
                break
            case 'Enter':
                e.preventDefault()
                if (highlight >= 0 && suggestions[highlight]) {
                    onSelectSuggestion(suggestions[highlight])
                } else {
                    onFormSubmit(e as any)
                }
                break
            case 'Escape':
                e.preventDefault()
                setShowSuggestions(false)
                break
        }
    }

    const handleAnimationComplete = () => {
        console.log('Component Initialized..');
    };

    return (
        <>
            <div id="searchContainer">
                <div className="search-container-parent">
                    <div className="heading-container">
                        <h1 id="heading" className='bricolage-grotesque-700'>
                            {(<SplitText
                                text="How's the sky looking today?"
                                className="text-2xl font-semibold text-center"
                                delay={80}
                                duration={0.5}
                                ease="power3.out"
                                splitType="chars"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                textAlign="center"
                                onLetterAnimationComplete={handleAnimationComplete}
                            />)}
                        </h1>
                    </div>
                    <div className="search-box-container">
                        <form onSubmit={onFormSubmit} className="search-form" role="search">
                            <div className="search-input-wrapper" ref={wrapperRef}>
                                <img src={iconSearch} alt="Search" className="search-icon" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    aria-label="Search for a place"
                                    placeholder="Search for a place..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    onFocus={() => {
                                        if (suggestions.length > 0 && !loading) setShowSuggestions(true)
                                    }}
                                    className="search-input dm-sans-300"
                                    autoComplete="off"
                                />

                                {showSuggestions && loading && (
                                    <div className="loading-dropdown" style={dropdownStyle}>
                                        <div className="loading-item dm-sans-300">
                                            <img src={iconLoading} alt="Loading" className="loading-icon" />
                                            <span>Search in progress</span>
                                        </div>
                                    </div>
                                )}

                                {showSuggestions && !loading && suggestions.length > 0 && (
                                    <ul
                                        role="listbox"
                                        aria-label="Search suggestions"
                                        className="suggestions-list"
                                        style={dropdownStyle}
                                    >
                                        {suggestions.map((s, i) => (
                                            <li
                                                key={s.id}
                                                role="option"
                                                aria-selected={i === highlight}
                                                onMouseDown={(ev) => {
                                                    ev.preventDefault()
                                                }}
                                                onClick={() => onSelectSuggestion(s)}
                                                onMouseEnter={() => setHighlight(i)}
                                                className={`suggestion-item ${i === highlight ? 'highlighted dm-sans-500' : 'dm-sans-300'}`}
                                            >
                                                {s.name}{s.country ? `, ${s.country}` : ''}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button
                                type="submit"
                                aria-label="Search"
                                className="search-button dm-sans-300"
                                disabled={loading}
                            >
                                {window.screen.width > 700 ? 'Search' : (<><img src={location_pin} alt="search" /></>)}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}