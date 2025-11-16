import { useState, useRef, useEffect } from 'react'
import { useGlobal } from '../utils/global_context'
import iconSearch from '../assets/icon-search.svg'
import iconLoading from '../assets/icon-loading.svg'
import initiateSearch from '../services/location_fetcher'

type Place = {
    id: number
    name: string
    country: string
    latitude: number
    longitude: number
}

type SearchBoxProps = {
    onSearch?: (place: Place) => void
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
    const { setLocationId, setLocationName, setLocationCountry, setLocationLattitude, setLocationLongitude } = useGlobal()
    
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Place[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [highlight, setHighlight] = useState<number>(-1)
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

    const debounceRef = useRef<number | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current)
        }
    }, [])

    // Handle click outside to close suggestions
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

    // Position dropdown and handle overflow
    useEffect(() => {
        if (!inputRef.current) return

        const inputRect = inputRef.current.getBoundingClientRect()
        setDropdownStyle({
            position: 'fixed',
            top: `${inputRect.bottom + 4}px`,
            left: `${inputRect.left}px`,
            width: `${inputRect.width}px`,
            zIndex: 999999,
        })
    }, [showSuggestions, suggestions, loading])

    // Fetch suggestions with debounce
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([])
            setShowSuggestions(false)
            setLoading(false)
            return
        }

        // Clear previous timer
        if (debounceRef.current) window.clearTimeout(debounceRef.current)
        
        // Show loading state immediately
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
        
        // Set global context
        setLocationId(place.id)
        setLocationName(place.name)
        setLocationCountry(place.country)
        setLocationLattitude(place.latitude)
        setLocationLongitude(place.longitude)
        
        if (onSearch) onSearch(place)
    }

    const onSelectSuggestion = (place: Place) => {
        submit(place)
    }

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!query.trim()) return

        // if a suggestion is highlighted, use it
        if (highlight >= 0 && suggestions[highlight]) {
            onSelectSuggestion(suggestions[highlight])
            return
        }
        
        // otherwise, trigger search without selection
        // in this case we submit the raw query - you may want to fetch here
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // If no suggestions visible, only handle Enter
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault()
                onFormSubmit(e as any)
            }
            return
        }

        // Handle arrow keys and Enter when suggestions are visible
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

    return (
        <>
            <div id="searchContainer">
                <div className="search-container-parent">
                    <div className="heading-container">
                        <p id="heading">How's the sky looking today?</p>
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
                                    className="search-input"
                                    autoComplete="off"
                                />
                                
                                { showSuggestions && loading && (
                                    <div className="loading-dropdown" style={dropdownStyle}>
                                        <div className="loading-item">
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
                                                className={`suggestion-item ${i === highlight ? 'highlighted' : ''}`}
                                            >
                                                {s.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button
                                type="submit"
                                aria-label="Search"
                                className="search-button"
                                disabled={loading}
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}