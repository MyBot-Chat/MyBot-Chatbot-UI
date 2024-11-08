import axios from 'axios';
import { baseUrl , API_TOKEN} from '../utils/config';

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request:', config);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('Network error:', error.message);
        } else {
            console.error('Response error:', error.response.status, error.response.data);
        }
        return Promise.reject(error);
    }
);

const get = async (endpoint: string, query?: any) => {

    try {
        const url = `${endpoint}/${query}`;
        const res = await axiosInstance.get(url);
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const post = async (endpoint: string, body: any) => {
    try {
        const res = await axiosInstance.post(endpoint, body);
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};
const del = async (endpoint: string)  => {
    try {
        const res = await axiosInstance.delete(endpoint);
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const handleAxiosError = (error: any) => {
    return error?.response?.data || { message: 'An unknown error occurred' };
};


export default { get, post, del };
