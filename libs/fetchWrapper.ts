import axios, { AxiosProgressEvent } from 'axios';
import { baseUrl , API_TOKEN} from '../utils/config';

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.method === 'post') {
            if (config.data instanceof FormData) {
                config.headers['Content-Type'] = 'multipart/form-data';
                
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
        }
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

const post = async (endpoint: string, body: any,  onProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    try {
        const res = await axiosInstance.post(endpoint, body,
        {
            onUploadProgress: onProgress,          
        });
        return res.data;
    } catch (error: any) {
        return handleAxiosError(error);
    }
};

const update = async (endpoint: string, body: any) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        const res = await axiosInstance.put(endpoint, body, { headers });
        return {
            status: res.status,
            data: res.data,
        };
    } catch (error: any) {
        console.error("Error:", error);
        return handleAxiosError(error);
    }
};
const del = async (endpoint: string, query?: any, reqData?: any) => {
    try {
      const res = await axiosInstance.delete(endpoint, {
        params: query,
        data: reqData, 
      });
      if (res.status === 200) {
        return { status: res.status, data: res.data };
      } else {
        return { status: res.status, message: 'Request was successful but no data returned.' };
      }
    } catch (error: any) {
      return handleAxiosError(error);
    }
  };

const handleAxiosError = (error: any) => {
    return error?.response?.data || { message: 'An unknown error occurred' };
};


export default { get, post, update, del };
