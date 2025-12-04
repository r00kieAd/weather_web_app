import API from '../config/endpoints.json';
import axios from 'axios';

interface SearchParams {
    name: string;
    count: number;
}

async function initiateSearch({name, count}: SearchParams) {
    const base = API.GEO_URI;
    const version = API.VERSION;
    const search = API.SEARCH;
    const url = `${base}/${version}/${search}?name=${name}&count=${count}&language=en&format=json`;
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
            return { status: req_succeeded, resp: response.data }
        } else {
            return { status: req_succeeded, statusCode: response.status, resp: response.statusText }
        };
    } catch (error) {
        const axiosError = error as import("axios").AxiosError;
        const message =
            (axiosError?.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
                ? (axiosError.response.data as { message?: string }).message
                : undefined) ||
            axiosError?.message ||
            "Something went wrong";

        return {
            status: false,
            statusCode: axiosError?.response?.status || 500,
            resp: message,
        };
    }
}

export default initiateSearch;
