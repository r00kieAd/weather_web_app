import errorImg from '../assets/error.png';
import { FallbackProps } from 'react-error-boundary'

// interface Params {
//     errorMessage?: string | undefined;
// };

function DisplayError({ error }: FallbackProps) {

    
    return (
        <>
            <div id="errDiv">
                <div className="errorContainer">
                    <div className='errContainerChild errImg'><img src={errorImg} alt="" /></div>
                    <div className='errContainerChild errText poppins-regular'>
                        {error?.message}
                    </div>
                </div>
            </div>
        </>
    )
};

export default DisplayError;