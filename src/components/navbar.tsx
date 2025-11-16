import { useState, useRef } from 'react'
import logo from '../assets/logo.svg'
import gear from '../assets/icon-units.svg'
import drop_icon from '../assets/icon-dropdown.svg'
import checkmark from '../assets/icon-checkmark.svg'
import temp from '../assets/fire-trend-hot.svg'
import drops from '../assets/droplets-rain-weather.svg'
import winds from '../assets/wind-weather.svg'
import DEFAULTS from '../config/defaults.json'
import { useGlobal } from '../utils/global_context'

export const NavBar: React.FC = () => {

    const [currUnit, setCurrUnit] = useState<string | undefined>(DEFAULTS.METRIC);
    const [targetUnit, setTargetUnit] = useState<string | undefined>(DEFAULTS.IMPERIAL);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const { isImperial, setIsImperial } = useGlobal();
    const dropdownDiv = useRef<HTMLDivElement>(null);
    const dropMenu = useRef<HTMLDivElement>(null);
    const dropdownDisplayButton = useRef<HTMLDivElement>(null);
    const dropIcon = useRef<HTMLDivElement>(null);

    function changeUnit() {
        if (currUnit == DEFAULTS.METRIC) {
            setCurrUnit(DEFAULTS.IMPERIAL);
            setTargetUnit(DEFAULTS.METRIC)
            setIsImperial(true);
        } else {
            setCurrUnit(DEFAULTS.METRIC);
            setTargetUnit(DEFAULTS.IMPERIAL);
            setIsImperial(false);
        }
    }

    function displayDropdown() {
        if (!dropdownVisible) {
            dropIcon.current?.classList.remove("rotate-0-animation");
            dropIcon.current?.classList.add("rotate-180-animation");
            dropdownDiv.current?.classList.remove("animate-slide-up");
            dropdownDiv.current?.classList.add("animate-slide-down");
            dropMenu.current?.classList.remove("animate-hide");
            dropMenu.current?.classList.add("animate-show");
            dropdownDiv.current?.classList.remove("hidden");
        } else {
            dropIcon.current?.classList.remove("rotate-180-animation");
            dropIcon.current?.classList.add("rotate-0-animation");
            dropdownDiv.current?.classList.remove("animate-slide-down");
            dropdownDiv.current?.classList.add("animate-slide-up");
            dropMenu.current?.classList.remove("animate-show");
            dropMenu.current?.classList.add("animate-hide");
            setTimeout(() => {
                dropdownDiv.current?.classList.add("hidden");
            }, 100);
        }
        setDropdownVisible(!dropdownVisible);
    }

    return (
        <>
            <div id="navbarContainer">
                <div className="navbar-components">
                    <div className="nav-logo">
                        <img src={logo} alt="weather" />
                    </div>
                    <div className="nav-menu-container">
                        <div className="nav-menu" onClick={displayDropdown} ref={dropdownDisplayButton}>
                            <div className="nav-menu-child menu-icon"><img src={gear} alt="gear" /></div>
                            <div className="nav-menu-child menu-label dm-sans-700">Units</div>
                            <div className="nav-menu-child drop-icon" ref={dropIcon}><img src={drop_icon} alt="" /></div>
                        </div>
                        <div className="drop-menu-container hidden" ref={dropdownDiv}>
                            <button className='unit-switch dm-sans-500' onClick={changeUnit}>Switch to {targetUnit}</button>
                            <div className="drop-menu" ref={dropMenu}>
                                <div className="display-option-for-unit dm-sans-300">
                                    <div className="display-unit display-temp-unit">
                                        <p className='unit-type dm-sans-700'>Temperature<img src={temp} alt="fire" /></p>
                                        <div className={`unit-container temp-unit-a temp-unit${!isImperial ? ' unit-checked' : ''}`}>
                                            <p className='unit-name'>Celsius (°C)</p>
                                            <p className='unit-checkmark unit-checkmark-a'>
                                                {!isImperial && <img src={checkmark} alt="checkmark" />}
                                            </p>
                                        </div>
                                        <div className={`unit-container temp-unit-b temp-unit${isImperial ? ' unit-checked' : ''}`}>
                                            <p className='unit-name'>Fahrenheit (°F)</p>
                                            <p className='unit-checkmark unit-checkmark-b'>
                                                {isImperial && <img src={checkmark} alt="checkmark" />}
                                            </p>
                                        </div>
                                        <br />
                                    </div>
                                    <div className="display-unit display-wind-unit">
                                        <p className='unit-type dm-sans-700'>Wind<img src={winds} alt="thermometer" /></p>
                                        <div className={`unit-container wind-unit-a wind-unit${!isImperial ? ' unit-checked' : ''}`}>
                                            <p className='unit-name'>km/h</p>
                                            <p className='unit-checkmark unit-checkmark-a'>
                                                {!isImperial && <img src={checkmark} alt="checkmark" />}
                                            </p>
                                        </div>
                                        <div className={`unit-container wind-unit-b wind-unit${isImperial ? ' unit-checked' : ''}`}>
                                            <p className='unit-name'>mph</p>
                                            <p className='unit-checkmark unit-checkmark-b'>
                                                {isImperial && <img src={checkmark} alt="checkmark" />}
                                            </p>
                                        </div>
                                        <br />
                                    </div>
                                    <div className="display-unit display-precipitation-unit">
                                        <p className='unit-type dm-sans-700'>Precipitation<img src={drops} alt="thermometer" /></p>
                                        <div className={`unit-container precipitation-unit-a precipitation-unit${!isImperial ? ' unit-checked' : ''}`}>
                                            <p className='unit-name'>Millimeters (mm)</p>
                                            <p className='unit-checkmark unit-checkmark-a'>
                                                {!isImperial && <img src={checkmark} alt="checkmark" />}
                                            </p>
                                        </div>
                                        <div className={`unit-container precipitation-unit-b precipitation-unit${isImperial ? ' unit-checked' : ''}`}>
                                            <p className='unit-name'>Inches (in)</p>
                                            <p className='unit-checkmark unit-checkmark-b'>
                                                {isImperial && <img src={checkmark} alt="checkmark" />}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}