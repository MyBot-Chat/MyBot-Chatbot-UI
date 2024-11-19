import {  CHATBOT_ID} from "@/utils/config";
import fetchWrapper from "../libs/fetchWrapper";

 const getChatbotFile = async () => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.get(`/api/Training/File`, chatbotId);
    if(response.length > 0){
      return {
          success: true,
          filesData: response,
        }
    }
    else{
      return {
          success: false,
          filesData: 'No messages found.',
        }
    }
  } catch (error) {
    console.error("Error fetching chatbot file data:", error);
    return { error: "Failed to retrieve chatbot file data" };
  }
};


 const uploadChatbotFile = async (file: FormData) => {
  const chatbotId = CHATBOT_ID as string;
  try {
    const response = await fetchWrapper.post(`/api/Training/File/${chatbotId}`, file);
    if(response){
      return response;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "File upload failed" };
  }
}

 const removeChatbotFile = async (id: number) => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.del(`/api/Training/File/${chatbotId}/${id}`);
    if (response.status === 200) {
      return { status: response.status };
    } else {
      return { status: response.status };
    }
    
  } catch (error) {
    console.error("Error removing file:", error);
    return { error: "File removal failed" };
  }
};

export const trainingService = {
  getChatbotFile,
  uploadChatbotFile,
  removeChatbotFile,
};

export default trainingService;



