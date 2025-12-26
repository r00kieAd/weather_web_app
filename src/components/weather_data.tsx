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
import empty from '../assets/space.png'
import night from '../assets/icon-night.png'
import { useGlobal } from '../utils/global_context'
import weatherCodes from '../config/weather_codes.json'
import ShowLoading from '../components/loading'
import DEFAULTS from '../config/defaults.json'


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
    const { setIsLoading, displayedDay, displayedDate, setDisplayedDay, setDisplayedDate, isImperial, locationTimezone, setLocationTimezone } = useGlobal();
    const [daysDropVisible, setDaysDropVisible] = useState<boolean>(false);

    const getNextSevenDays = (): string[] => {
        const days: string[] = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            days.push(dayName);
        }
        
        return days;
    };

    const getAllDays = getNextSevenDays();
    const [dummyDays, setDummyDays] = useState<string[]>(getAllDays);
    const [selectedDay, setSelectedDay] = useState<string>(getAllDays[0]);

    useEffect(() => {
        if (dummyDays.length > 0) {
            setSelectedDay(dummyDays[0]);
        }
    }, [dummyDays]);

    useEffect(() => {
        const now = new Date();
    
        const dayName = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
        const day = now.getUTCDate();
        const month = now.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
        const year = now.getUTCFullYear();
        const getOrdinalSuffix = (num: number): string => {
            const j = num % 10;
            const k = num % 100;
            
            if (j === 1 && k !== 11) return 'st';
            if (j === 2 && k !== 12) return 'nd';
            if (j === 3 && k !== 13) return 'rd';
            return 'th';
        };
        
        const dateStr = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
        
        setDisplayedDay(dayName);
        setDisplayedDate(dateStr);
    }, [])

    const getIconForWeatherCode = (weatherCode: number, isDay: number): string => {
        // if (weatherCode === -1) alert('-1');
        const codeStr = weatherCode.toString();
        const weatherData = weatherCodes.weather_descriptions[codeStr as keyof typeof weatherCodes.weather_descriptions];
        
        if (!weatherData) return sunny;

        const weatherValue = weatherData.value;
        console.log(weatherValue);
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
                return empty;
        }
    };

    useEffect(() => {
        console.log(hourlyData);
        const dummyHourlyData: HourlyForecast[] = [];
        
        const timezone = locationTimezone ? locationTimezone.split(' ')[0] : 'GMT';
        const now = new Date();
        const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
        const tomorrow = new Date(timeInTimezone);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDateStr = tomorrow.getFullYear() + '-' +
                                String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' +
                                String(tomorrow.getDate()).padStart(2, '0');
        let startIndex = 0;
        if (hourlyData?.time && hourlyData.time.length > 0) {
            for (let i = 0; i < hourlyData.time.length; i++) {
                const timeStr = hourlyData.time[i];
                const dateStr = timeStr.substring(0, 10);
                const hour = parseInt(timeStr.substring(11, 13));
                
                if (dateStr === tomorrowDateStr && hour === 0) {
                    startIndex = i;
                    break;
                }
            }
        }
        
        const forecastDays: string[] = [];
        let dayDate = new Date(tomorrow);
        for (let d = 0; d < 7; d++) {
            const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
            forecastDays.push(dayName);
            dayDate.setDate(dayDate.getDate() + 1);
        }
        
        if (forecastDays.length > 0) {
            setDummyDays(forecastDays);
        }
        
        for (let i = 0; i < 8; i++) {
            const index = startIndex + i;
            if (hourlyData?.time && index < hourlyData.time.length) {
                const weatherCode = hourlyData.iconCode?.[index] ?? 999;
                dummyHourlyData.push({
                    time: hourlyData.time[index].substring(11),
                    icon: getIconForWeatherCode(weatherCode, is_day),
                    temp: hourlyData.temperature_2m[index] ? Math.round(hourlyData.temperature_2m[index]) : 0
                });
            } else {
                dummyHourlyData.push({
                    time: '',
                    icon: empty,
                    temp: 0
                });
            }
        }
        
        setHourlyForecast(dummyHourlyData);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [hourlyData, locationTimezone]);

    // const main_icon = sunny;

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
            setSelectedDay(day);
            closeDaysDrop();
            
            const timezone = locationTimezone ? locationTimezone.split(' ')[0] : 'UTC';
            const now = new Date();
            const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
            
            // Calculate tomorrow's date
            const tomorrow = new Date(timeInTimezone);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Find which day was selected (0-6)
            const selectedDayIndex = dummyDays.indexOf(day);
            
            // Calculate the date for the selected day
            const selectedDate = new Date(tomorrow);
            selectedDate.setDate(selectedDate.getDate() + selectedDayIndex);
            const selectedDateStr = selectedDate.getFullYear() + '-' +
                                    String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
                                    String(selectedDate.getDate()).padStart(2, '0');
            
            // Find index of selected day at 00:00
            let dayStartIndex = 0;
            if (hourlyData?.time && hourlyData.time.length > 0) {
                for (let i = 0; i < hourlyData.time.length; i++) {
                    const timeStr = hourlyData.time[i];
                    const dateStr = timeStr.substring(0, 10);
                    const hour = parseInt(timeStr.substring(11, 13));
                    
                    if (dateStr === selectedDateStr && hour === 0) {
                        dayStartIndex = i;
                        break;
                    }
                }
            }
            
            // Populate with selected day's hours (00:00-07:00)
            const dummyHourlyData: HourlyForecast[] = [];
            for (let i = 0; i < 8; i++) {
                const index = dayStartIndex + i;
                if (hourlyData?.time && index < hourlyData.time.length) {
                    const weatherCode = hourlyData.iconCode?.[index] ?? 999;
                    dummyHourlyData.push({
                        time: hourlyData.time[index].substring(11),
                        icon: getIconForWeatherCode(weatherCode, is_day),
                        temp: hourlyData.temperature_2m[index] ? Math.round(hourlyData.temperature_2m[index]) : 0
                    });
                } else {
                    dummyHourlyData.push({
                        time: '',
                        icon: empty,
                        temp: 0
                    });
                }
            }
            
            setHourlyForecast(dummyHourlyData);
        }
    }

    return (<>
        <div id="weatherContainer">
            <div className="weather-components-parent">
                <div className="weather-component weather-component-1">
                    <ShowLoading/>
                    <div className="weather-data main-weather-display weather-data-1">
                        <div className="main-weather-bg-container">
                        </div>
                        <div className="weather-display-container">
                            <div className="main-place-date-info">
                                <div className="place-info dm-sans-600">{locationName}{locationCountry? `, ${locationCountry}` : ''}</div>
                                <div className="date-info dm-sans-500">{displayedDay} {displayedDate}</div>
                            </div>
                            <div className="main-tempearature-info">
                                <div className="main-weather-icon">
                                    <img src={getIconForWeatherCode(currWeatherCode ?? 999, is_day)} alt="" className="main-icon" />
                                </div>
                                <div className="main-temperature-info dm-sans-600i">
                                    <p className='main-temp'>{temperature} {isImperial ? DEFAULTS.FAHRENHEIT : DEFAULTS.CELCIUS}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="weather-data main-weather-metrics weather-data-2">
                        <div className="weather-metrics-container">
                            <div className="feels-like-metric weather-metrics">
                                <p className="feels-like-heading stat-name dm-sans-500">Feels Like</p>
                                <span className="feels-like-data stat-value dm-sans-300">{feelsLike} {isImperial ? DEFAULTS.FAHRENHEIT : DEFAULTS.CELCIUS}</span>
                            </div>
                            <div className="humidity-metric weather-metrics">
                                <p className="humidity-heading stat-name dm-sans-500">Humidity</p>
                                <span className="humidity-data stat-value dm-sans-300">{humidity}%</span>
                            </div>
                            <div className="wind-metric weather-metrics">
                                <p className="wind-heading stat-name dm-sans-500">Wind</p>
                                <span className="wind-data stat-value dm-sans-300">{wind} {isImperial ? DEFAULTS.MPH : DEFAULTS.KMPH}</span>
                            </div>
                            <div className="precipiration-metric weather-metrics">
                                <p className="precipiration-heading stat-name dm-sans-500">Precipiration</p>
                                <span className="precipiration-data stat-value dm-sans-300">{precipitation}{isImperial ? DEFAULTS.IN : DEFAULTS.MM}</span>
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
                    <ShowLoading/>
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
                                        <p className={`hf-temp hf-d${index + 1}-temp`}>{hour.temp} {isImperial ? DEFAULTS.FAHRENHEIT : DEFAULTS.CELCIUS}</p>
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