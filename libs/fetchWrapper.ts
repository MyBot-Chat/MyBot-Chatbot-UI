import axios from "axios";
import { baseUrl } from "../utils/config";

type QueryT = { [key: string]: string | number | boolean | null | undefined };

const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_TOKEN}`,
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
    (response) => {
        console.log('Response:', response);
        return response.data;
    },
    (error) => {
        console.error('Response Error:', error);
        return Promise.reject(error.response ? error.response.data : error.message);
    }
);


const get = async (endpoint: string, query?: QueryT) => {
    try {
        const url = `${endpoint}${query ? `?${new URLSearchParams(query as Record<string, string>)}` : ""}`;
        const res = await axiosInstance.get(url);
        return res; 
    } catch (error: any) {
        return handleAxiosError(error); 
    }
};


const post = async (endpoint: string, body: any) => {
    try {
        const res = await axiosInstance.post(endpoint, body);
        return res;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const put = async (endpoint: string, body: any) => {
    try {
        const res = await axiosInstance.put(endpoint, body);
        return res;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const del = async (endpoint: string) => {
    try {
        const res = await axiosInstance.delete(endpoint);
        return res;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const handleAxiosError = (error: any) => {
    return error?.response?.data || { message: "An unknown error occurred" };
};

export default { get, post, put, del };
