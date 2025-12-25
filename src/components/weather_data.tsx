import { useEffect, useState, useRef } from 'react'
import sunny from '../assets/icon-sunny.webp'
import drizzle from '../assets/icon-drizzle.webp'
import partlyCloudy from '../assets/icon-partly-cloudy.webp'
import overcast from '../assets/icon-overcast.webp'
import fog from '../assets/icon-fog.webp'
import rain from '../assets/icon-rain.webp'
import storm from '../assets/icon-storm.webp'
import snow from '../assets/icon-snow.webp'
import drop_icon from '../assets/icon-dropdown.svg'
import night from '../assets/icon-night.png'
import { useGlobal } from '../utils/global_context'
import weatherCodes from '../config/weather_codes.json'


// interface ForecastDay {
//     day: string
//     icon: string
//     maxTemp: number
//     minTemp: number
// }

interface HourlyForecast {
    time: string
    icon: string
    temp: number
}

export const WeatherData: React.FC = () => {
    // const [dailyForecast, setDailyForecast] = useState<ForecastDay[]>([])
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([])
    const daysDropMenuDiv = useRef<HTMLDivElement>(null);
    const dropMenuIcon = useRef<HTMLDivElement>(null);
    const daysDrop = useRef<HTMLDivElement>(null);
    const { temperature, feelsLike, humidity, wind, precipitation, locationName, locationCountry, currWeatherCode, is_day, hourlyData } = useGlobal();

    const [daysDropVisible, setDaysDropVisible] = useState<boolean>(false);

    const dummyDays: string[] = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday']
    const [selectedDay, setSelectedDay] = useState<string>(dummyDays[0])

    // Function to map weather code to icon
    const getIconForWeatherCode = (weatherCode: number, isDay: number): string => {
        const codeStr = weatherCode.toString();
        const weatherData = weatherCodes.weather_descriptions[codeStr as keyof typeof weatherCodes.weather_descriptions];
        
        if (!weatherData) return sunny;

        const weatherValue = weatherData.value;
        
        switch (weatherValue) {
            case 'clear':
            case 'mostly_clear':
                if (isDay === 0) {
                    return night;
                } else {
                    return sunny;
                }
            case 'partly_cloudy':
                return partlyCloudy;
            case 'overcast':
                return overcast;
            case 'fog':
                return fog;
            case 'drizzle':
                return drizzle;
            case 'rain':
            case 'showers':
                return rain;
            case 'snow':
            case 'snow_showers':
                return snow;
            case 'thunderstorm':
                return storm;
            default:
                return sunny;
        }
    };

    useEffect(() => {
        console.log(hourlyData);
        const dummyHourlyData: HourlyForecast[] = [];
        for (let i = 0; i < 8; i++) {
            const weatherCode = hourlyData?.iconCode?.[i] ?? 0;
            dummyHourlyData.push({
                time: hourlyData?.time[i] ? hourlyData.time[i].substring(11) : '',
                icon: getIconForWeatherCode(weatherCode, is_day),
                temp: hourlyData?.temperature_2m[i] ? Math.round(hourlyData.temperature_2m[i]) : 0
            });
        };
        setHourlyForecast(dummyHourlyData);
    }, [hourlyData]);

    const main_icon = sunny;

    function displayDaysDrop() {
        if (!daysDropVisible) {
            dropMenuIcon.current?.classList.remove("rotate-0-animation");
            dropMenuIcon.current?.classList.add("rotate-180-animation");
            daysDropMenuDiv.current?.classList.remove("animate-slide-up");
            daysDropMenuDiv.current?.classList.add("animate-slide-down");
            daysDrop.current?.classList.remove("animate-hide");
            daysDrop.current?.classList.add("animate-show");
            daysDropMenuDiv.current?.classList.remove("hidden");
        } else {
            dropMenuIcon.current?.classList.remove("rotate-180-animation");
            dropMenuIcon.current?.classList.add("rotate-0-animation");
            daysDropMenuDiv.current?.classList.remove("animate-slide-down");
            daysDropMenuDiv.current?.classList.add("animate-slide-up");
            daysDrop.current?.classList.remove("animate-show");
            daysDrop.current?.classList.add("animate-hide");
            setTimeout(() => {
                daysDropMenuDiv.current?.classList.add("hidden");
            }, 100);
        }
        setDaysDropVisible(!daysDropVisible);
    }

    function closeDaysDrop() {
        if (daysDropVisible) {
            dropMenuIcon.current?.classList.remove("rotate-180-animation");
            dropMenuIcon.current?.classList.add("rotate-0-animation");
            daysDropMenuDiv.current?.classList.remove("animate-slide-down");
            daysDropMenuDiv.current?.classList.add("animate-slide-up");
            daysDrop.current?.classList.remove("animate-show");
            daysDrop.current?.classList.add("animate-hide");
            setTimeout(() => {
                daysDropMenuDiv.current?.classList.add("hidden");
            }, 100);

            setDaysDropVisible(false);
        }

    }

    function selectDay(day?: string) {
        if (day) {
            setSelectedDay(day)
            // close the dropdown after selecting
            closeDaysDrop()
        }
    }

    return (<>
        <div id="weatherContainer">
            <div className="weather-components-parent">
                <div className="weather-component weather-component-1">
                    <div className="weather-data main-weather-display weather-data-1">
                        <div className="main-weather-bg-container">
                        </div>
                        <div className="weather-display-container">
                            <div className="main-place-date-info">
                                <div className="place-info dm-sans-600">{locationName}{locationCountry? `, ${locationCountry}` : ''}</div>
                                <div className="date-info dm-sans-500">Thursday, Aug 5, 2025</div>
                            </div>
                            <div className="main-tempearature-info">
                                <div className="main-weather-icon">
                                    <img src={getIconForWeatherCode(currWeatherCode ?? 0, is_day)} alt="" className="main-icon" />
                                </div>
                                <div className="main-temperature-info dm-sans-600i">
                                    <p className='main-temp'>{temperature}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="weather-data main-weather-metrics weather-data-2">
                        <div className="weather-metrics-container">
                            <div className="feels-like-metric weather-metrics">
                                <p className="feels-like-heading stat-name dm-sans-500">Feels Like</p>
                                <span className="feels-like-data stat-value dm-sans-300">{feelsLike}</span>
                            </div>
                            <div className="humidity-metric weather-metrics">
                                <p className="humidity-heading stat-name dm-sans-500">Humidity</p>
                                <span className="humidity-data stat-value dm-sans-300">{humidity}%</span>
                            </div>
                            <div className="wind-metric weather-metrics">
                                <p className="wind-heading stat-name dm-sans-500">Wind</p>
                                <span className="wind-data stat-value dm-sans-300">{wind} kmph</span>
                            </div>
                            <div className="precipiration-metric weather-metrics">
                                <p className="precipiration-heading stat-name dm-sans-500">Precipiration</p>
                                <span className="precipiration-data stat-value dm-sans-300">{precipitation} mm</span>
                            </div>
                        </div>
                    </div>
                    {/* <div className="wather-data main-daily-forecast weather-data-3">
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
                    </div> */}
                </div>
                <div className="weather-component weather-component-2">
                    <div className="weather-data hourly-forecast">
                        <div className="hourly-forecast-headers">
                            <span className="hf-heading dm-sans-500">Hourly Forecast</span>
                            <div className="hf-days-dropdown-container">
                                <div className="drop-button-container">
                                    <button className="drop-button dm-sans-500" onClick={displayDaysDrop} onBlur={closeDaysDrop}>
                                        <span className="drop-button-label">{selectedDay}</span>
                                        <div className="drop-button-icon" ref={dropMenuIcon}><img src={drop_icon} alt="" /></div>
                                    </button>
                                    <div className="days-menu-drop hidden" ref={daysDropMenuDiv}>
                                        <div className="days-container dm-sans-300" ref={daysDrop}>
                                            {dummyDays.map((day, idx) => (
                                                <div key={day} className={`day-container ${selectedDay === day ? 'selected' : ''}`} onClick={() => selectDay(day)}>
                                                    <span className={`day day${idx + 1}`}>{day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hf-data-container">
                            {hourlyForecast.map((hour, index) => (
                                <div key={index} className={`hf-data hf-data-hour-${index + 1}`}>
                                    <div className="left-side-data dm-sans-300">
                                        <div className={`hf-icon hf-icon-h${index + 1}`}>
                                            <img src={hour.icon} alt={hour.time} />
                                        </div>
                                        <p className="hf-h-time">{hour.time}</p>
                                    </div>
                                    <div className="right-side-data dm-sans-500">
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