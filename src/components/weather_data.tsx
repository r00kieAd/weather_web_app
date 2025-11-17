import { useEffect, useState } from 'react'
import sunny from '../assets/icon-sunny.webp'

interface ForecastDay {
    day: string
    icon: string
    maxTemp: number
    minTemp: number
}

interface HourlyForecast {
    time: string
    icon: string
    temp: number
}

export const WeatherData: React.FC = () => {
    const [forecast, setForecast] = useState<ForecastDay[]>([])
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([])

    // Dummy JSON data for daily forecast
    const dummyForecastData: ForecastDay[] = [
        { day: 'Mon', icon: sunny, maxTemp: 22, minTemp: 15 },
        { day: 'Tue', icon: sunny, maxTemp: 20, minTemp: 14 },
        { day: 'Wed', icon: sunny, maxTemp: 19, minTemp: 13 },
        { day: 'Thu', icon: sunny, maxTemp: 21, minTemp: 16 },
        { day: 'Fri', icon: sunny, maxTemp: 23, minTemp: 17 },
        { day: 'Sat', icon: sunny, maxTemp: 25, minTemp: 18 },
        { day: 'Sun', icon: sunny, maxTemp: 24, minTemp: 19 }
    ]

    // Dummy JSON data for hourly forecast (8 hours)
    const dummyHourlyData: HourlyForecast[] = [
        { time: '12 AM', icon: sunny, temp: 18 },
        { time: '3 AM', icon: sunny, temp: 16 },
        { time: '6 AM', icon: sunny, temp: 15 },
        { time: '9 AM', icon: sunny, temp: 17 },
        { time: '12 PM', icon: sunny, temp: 20 },
        { time: '3 PM', icon: sunny, temp: 22 },
        { time: '6 PM', icon: sunny, temp: 19 },
        { time: '9 PM', icon: sunny, temp: 17 }
    ]

    useEffect(() => {
        setForecast(dummyForecastData)
        setHourlyForecast(dummyHourlyData)
    }, [])

    const main_icon = sunny;

    return (<>
        <div id="weatherContainer">
            <div className="weather-components-parent">
                <div className="weather-component weather-component-1">
                    <div className="weather-data main-weather-display weather-data-1">
                        <div className="weather-display-container">
                            <div className="main-place-date-info">
                                <div className="place-info">Berlin, Germany</div>
                                <div className="date-info">Thursday, Aug 5, 2025</div>
                            </div>
                            <div className="main-tempearature-info">
                                <div className="main-weather-icon">
                                    <img src={main_icon} alt="" className="main-icon" />
                                </div>
                                <div className="main-temperature-info">
                                    <p className='main-temp'>20</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="weather-data main-weather-metrics weather-data-2">
                        <div className="weather-metrics-container">
                            <div className="feels-like-metric weather-metrics">
                                <p className="feels-like-heading">Feels Like</p>
                                <p className="feels-like-data">18</p>
                            </div>
                            <div className="humidity-metric weather-metrics">
                                <p className="humidity-heading">Humidity</p>
                                <p className="humidity-data">46%</p>
                            </div>
                            <div className="wind-metric weather-metrics">
                                <p className="wind-heading">Wind</p>
                                <p className="wind-data">14 kmph</p>
                            </div>
                            <div className="precipiration-metric weather-metrics">
                                <p className="precipiration-heading">Precipiration</p>
                                <p className="precipiration-data">0 mm</p>
                            </div>
                        </div>
                    </div>
                    <div className="wather-data main-daily-forecast weather-data-3">
                        <div className="daily-forecast-heading">
                            <p className="df-heading">Daily Forecast</p>
                        </div>
                        <div className="daily-forecast-container">
                            {forecast.map((day, index) => (
                                <div key={index} className={`daily-forecast daily-forcast-day-${index + 1}`}>
                                    <div className="inner-daily-forecast-wrap">
                                        <p className="day">{day.day}</p>
                                        <div className={`df-icon df-icon-d${index + 1}`}>
                                            <img src={day.icon} alt={day.day} />
                                        </div>
                                        <div className={`df-temps df-temps-d${index + 1}`}>
                                            <p className={`df${index + 1}-max`}>{day.maxTemp}</p>
                                            <p className={`df${index + 1}-min`}>{day.minTemp}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="weather-component weather-component-2">
                    <div className="weather-data hourly-forecast">
                        <div className="hourly-forecast-headers">
                            <p className="hf-heading">Hourly Forecast</p>
                            <div className="hf-days-dropdown-container">
                                dropdown
                            </div>
                        </div>
                        <div className="hf-data-container">
                            {hourlyForecast.map((hour, index) => (
                                <div key={index} className={`hf-data hf-data-hour-${index + 1}`}>
                                    <div className="left-side-data">
                                        <div className={`hf-icon-h${index + 1}`}>
                                            <img src={hour.icon} alt={hour.time} />
                                        </div>
                                        <p className="hf-h-time">{hour.time}</p>
                                    </div>
                                    <div className="right-side-data">
                                        <p className={`hf-temp hf-d${index + 1}-temp`}>{hour.temp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}