import axios from "axios";
import { baseUrl } from "../utils/config";

type QueryT = { [key: string]: string | number | boolean | null | undefined };

const get = async (endpoint: string, query?: QueryT) => {
  try {
    const url = `${baseUrl}${endpoint}${query ? `?${new URLSearchParams(query as Record<string, string>)}` : ""}`;
    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

const post = async (endpoint: string, body: any) => {
  try {
    const res = await axios.post(`${baseUrl}${endpoint}`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

const put = async (endpoint: string, body: any) => {
  try {
    const res = await axios.put(`${baseUrl}${endpoint}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

const del = async (endpoint: string) => {
  try {
    const res = await axios.delete(`${baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export default { get, post, put, del };