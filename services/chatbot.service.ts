import { CHATBOT_ID } from "@/utils/config";
import fetchWrapper from "../libs/fetchWrapper";

const getAllSession = async (start: number = 0, size:number = 50,  startDate?: Date , endDate?: Date): Promise<any> => {

  try {
    let queryParams = `start=${start}&limit=${size}`;
    if (startDate) {
      queryParams += `&startDate=${startDate.toISOString()}`;
    }
    if (endDate) {
      queryParams += `&endDate=${endDate.toISOString()}`;
    }

    const response = await fetchWrapper.getSessionAll(
      `/api/Conversation/${CHATBOT_ID}?${queryParams}`
    );

    return {
      status: response.statusCode,
      data : response.data,
      message : response.message
    };
  } catch (error) {
    console.error("Error fetching chatbot sessions:", error);
    return {
      success: false,
      message: "Failed to fetch chatbot sessions. Please try again later.",
    };
  }
};

export const ChatbotServices = {
  getAllSession,
};

export default ChatbotServices;
