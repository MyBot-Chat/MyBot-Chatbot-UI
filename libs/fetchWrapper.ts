import axios, { AxiosRequestConfig } from 'axios';
import { baseUrl } from '../utils/config';

type QueryT = Record<string, string | number | boolean | null | undefined>;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    withCredentials: true
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


const get = async <T = any>(endpoint: string, query?: QueryT, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const url = `${endpoint}${query ? `?${new URLSearchParams(query as Record<string, string>)}` : ''}`;
        const res = await axiosInstance.get<T>(url, config,);
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const post = async <T = any>(endpoint: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const res = await axiosInstance.post<T>(endpoint, body, config);
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const put = async <T = any>(endpoint: string, body: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const res = await axiosInstance.put<T>(endpoint, body, config);
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const del = async <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const res = await axiosInstance.delete<T>(endpoint, config);
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const handleAxiosError = (error: any) => {
    return error?.response?.data || { message: 'An unknown error occurred' };
};


export default { get, post, put, del };
