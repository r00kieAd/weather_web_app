import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

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
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalProvider({children}: {children: ReactNode}) {
    const [isImperial, setIsImperial] = useState<boolean>(false);
    const [displayedLocation, setDisplayedLocation] = useState<string>("");
    const [displayedDay, setDisplayedDay] = useState<string>("");
    const [displayedDate, setDisplayedDate] = useState<string>("");
    const [temperature, setTemperature] = useState<number>(0);
    const [feelsLike, setFeelsLike] = useState<string>("");
    const [humidity, setHumidity] = useState<string>("");
    const [wind, setWind] = useState<number>(0);
    const [precipitation, setPrecipitation] = useState<number>(0);

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