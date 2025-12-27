import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface HourlyData {
    time: string[];
    temperature_2m: number[];
    iconCode: number[];
    is_day: number[];
}

interface DailyData {
    time: string[];
    maxTemp: number[];
    minTemp: number[];
    iconCode: number[];
}

interface GlobalState {
    isImperial: boolean;
    setIsImperial: (value: boolean) => null;
    displayedLocation: string;
    setDisplayedLocation: (value: string) => null;
    displayedDay: string;
    setDisplayedDay: (value: string) => null;
    displayedDate: string;
    setDisplayedDate: (value: string) => null;
    temperature: number;
    setTemperature: (value: number) => null;
    feelsLike: string;
    setFeelsLike: (value: string) => null;
    humidity: string;
    setHumidity: (value: string) => null;
    wind: number;
    setWind: (value: number) => null;
    precipitation: number;
    setPrecipitation: (value: number) => null;
    locationId: number;
    setLocationId: (value: number) => null;
    locationName: string;
    setLocationName: (value: string) => null;
    locationCountry: string;
    setLocationCountry: (value: string) => null;
    currWeatherCode?: number;
    setCurrWeatherCode?: (value: number) => null;
    is_day: number;
    setIsDay: (value: number) => null;
    locationLattitude: number;
    setLocationLattitude: (value: number) => null;
    locationLongitude: number;
    setLocationLongitude: (value: number) => null;
    locationTimezone: string;
    setLocationTimezone: (value: string) => null;
    hourlyData?: HourlyData;
    setHourlyData: (value: HourlyData) => null;
    dailyData?: DailyData;
    setDailyData: (value: DailyData) => null;
    isLoading: boolean;
    setIsLoading: (value: boolean) => null;
    forecastDataLoaded: boolean;
    setforecastDataLoaded: (value: boolean) => null;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
    const [isImperial, setIsImperial] = useState<boolean>(false);
    const [displayedLocation, setDisplayedLocation] = useState<string>("no data");
    const [displayedDay, setDisplayedDay] = useState<string>("no data");
    const [displayedDate, setDisplayedDate] = useState<string>("no data");
    const [temperature, setTemperature] = useState<number>(0);
    const [feelsLike, setFeelsLike] = useState<string>("0");
    const [humidity, setHumidity] = useState<string>("0");
    const [wind, setWind] = useState<number>(0);
    const [precipitation, setPrecipitation] = useState<number>(0);
    const [locationId, setLocationId] = useState<number>(0);
    const [locationName, setLocationName] = useState<string>("no data");
    const [locationCountry, setLocationCountry] = useState<string>("");
    const [locationTimezone, setLocationTimezone] = useState<string>("GMT");
    const [locationLattitude, setLocationLattitude] = useState<number>(0);
    const [locationLongitude, setLocationLongitude] = useState<number>(0);
    const [currWeatherCode, setCurrWeatherCode] = useState<number>(999);
    const [is_day, setIsDay] = useState<number>(1);
    const [hourlyData, setHourlyData] = useState<HourlyData | undefined>(undefined);
    const [dailyData, setDailyData] = useState<DailyData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [forecastDataLoaded, setforecastDataLoaded] = useState<boolean>(false);

    return (
        <GlobalContext.Provider value={{
            isImperial,
            setIsImperial,
            displayedLocation,
            setDisplayedLocation,
            displayedDay,
            setDisplayedDay,
            displayedDate,
            setDisplayedDate,
            temperature,
            setTemperature,
            feelsLike,
            setFeelsLike,
            humidity,
            setHumidity,
            wind,
            setWind,
            precipitation,
            setPrecipitation,
            locationId,
            setLocationId,
            locationName,
            setLocationName,
            locationCountry,
            setLocationCountry,
            currWeatherCode,
            setCurrWeatherCode,
            locationLattitude,
            setLocationLattitude,
            locationLongitude,
            setLocationLongitude,
            locationTimezone,
            setLocationTimezone,
            hourlyData,
            setHourlyData,
            is_day,
            setIsDay,
            isLoading,
            setIsLoading,
            forecastDataLoaded,
            setforecastDataLoaded,
            dailyData,
            setDailyData
        } as unknown as GlobalState}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("useGlobal must be used inside GlobalProvider");
    return context;
}