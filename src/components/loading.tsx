import loading_icon from '../assets/icon-loading.svg'
import { useGlobal } from '../utils/global_context';

function ShowLoading() {
    const { isLoading } = useGlobal();
    return (
        <>
            {isLoading && <div className="loading-overlay">
                <div className="inner-loading-comps">
                    <img src={loading_icon} alt="Loading" />
                    <span className='dm-sans-300'>Updating data...</span>
                </div>
            </div>}
        </>
    )
}

export default ShowLoading;