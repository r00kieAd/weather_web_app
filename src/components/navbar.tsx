import { useEffect, useState, useRef } from 'react'
import logo from '../assets/logo.svg'
import gear from '../assets/icon-units.svg'
import drop_icon from '../assets/icon-dropdown.svg'
import checkmark from '../assets/icon-checkmark.svg'
import DEFAULTS from '../config/defaults.json'
import { useGlobal } from '../utils/global_context'

export const NavBar: React.FC = () => {

    const [currUnit, setCurrUnit] = useState<string | undefined>(DEFAULTS.METRIC);
    const [targetUnit, setTargetUnit] = useState<string | undefined>(DEFAULTS.IMPERIAL);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const { isImperial, setIsImperial } = useGlobal();
    const dropdownDiv = useRef<HTMLDivElement>(null);
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
            dropdownDiv.current?.classList.remove("animate-hide");
            dropdownDiv.current?.classList.add("animate-show");
            dropdownDiv.current?.classList.remove("hidden");
        } else {
            dropIcon.current?.classList.remove("rotate-180-animation");
            dropIcon.current?.classList.add("rotate-0-animation");
            dropdownDiv.current?.classList.remove("animate-show");
            dropdownDiv.current?.classList.add("animate-hide");
            dropdownDiv.current?.classList.add("hidden");
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
                            <div className="nav-menu-child menu-label">Units</div>
                            <div className="nav-menu-child drop-icon" ref={dropIcon}><img src={drop_icon} alt="" /></div>
                        </div>
                        <div className="drop-menu-container hidden" ref={dropdownDiv}>
                            <button className='unit-switch' onClick={changeUnit}>Switch to {targetUnit}</button>
                            <div className="drop-menu">
                                <div className="display-option-for-unit">
                                    <div className="display-temp-unit">
                                        <p>Temperature</p>
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
                                    <div className="display-wind-unit">
                                        <p>Wind</p>
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
                                    <div className="display-precipitation-unit">
                                        <p>Precipitation</p>
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