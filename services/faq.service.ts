import {  CHATBOT_ID} from "@/utils/config";
import fetchWrapper from "../libs/fetchWrapper";
import { QAInputDto, QAInputModelDto } from "@/utils/dtos/DataDto";


 const getChatbotQA = async () => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.get(`/api/Training/QA`, chatbotId);
    if(response.length > 0){
      return {
          success: true,
          QAData: response,
        }
    }
    else{
      return {
          success: false,
          QAData: 'No messages found.',
        }
    }
  } catch (error) {
    console.error("Error fetching chatbot QA data:", error);
    return { error: "Failed to retrieve chatbot QA data" };
  }
};


 const uploadChatbotQA = async (qaInput: QAInputModelDto) => {
  const chatbotId = CHATBOT_ID as string;
  try {
    const response = await fetchWrapper.post(`/api/Training/QA/${chatbotId}`, qaInput);
    if(response){
      return response;
    }
  } catch (error) {
    console.error("Error uploading QA:", error);
    return { error: "QA upload failed" };
  }
}

const updateQA = async (id: number, data: QAInputDto) => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.update(`/api/Training/QA/${chatbotId}/${id}`, data);

    if (response.status === 200) {
      return { status: response.status, message: "Successfully update website links." };
    } else {
      return { status: response.status, message: "Failed to update website links." };
    }
  } catch (error) {
    console.error("Error update link:", error);
    return { error: "Link update failed" };
  }
};
 const removeChatbotQA = async (id: number) => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.del(`/api/Training/QA/${chatbotId}/${id}`);
    if (response.status === 200) {
      return { status: response.status };
    } else {
      return { status: response.status };
    }
    
  } catch (error) {
    console.error("Error removing QA:", error);
    return { error: "QA removal failed" };
  }
};

export const faqService = {
  getChatbotQA,
  uploadChatbotQA,
  updateQA,
  removeChatbotQA,
};

export default faqService;



