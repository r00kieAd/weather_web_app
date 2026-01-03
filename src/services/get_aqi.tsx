import API from '../config/endpoints.json';
import axios from 'axios';
// import { useGlobal } from '../utils/global_context'
interface LocationParams {
    longitude: string;
    latitude: string;
    timezone: string;    
}

async function getAirQualityIndex({longitude, latitude, timezone}: LocationParams) {
    const base = API.AQI_URI;
    const version = API.VERSION;
    const forecast = API.AIR_QUALITY;
    const params = API.AQI_PARAMS;
    const url = `${base}/${version}/${forecast}?latitude=${latitude}&longitude=${longitude}&${params}${timezone}`
    const options = {
        method: 'GET',
        url: url,
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        }
    }

    try {
        const response = await axios.request(options);
        const req_succeeded = response.status >= 200 && response.status < 300;
        if (req_succeeded) {
            // console.log(response.data);
            return {status: req_succeeded, resp: response.data};
        }
        return {status: req_succeeded, statusCode: response.status, resp: response.statusText}
    } catch (error) {
        const axiosError = error as import("axios").AxiosError;
        const message = (axiosError?.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data ? (axiosError.response.data as {message?: string}).message : undefined) || axiosError?.message || "Something went wrong";
        return {
            status: false,
            statusCode: axiosError?.response?.status || 500,
            resp: message
        };
    }
}

export default getAirQualityIndex