import { USER_ID , CHATBOT_ID} from "@/utils/config";
import fetchWrapper from "../libs/fetchWrapper";

export const getChatbotFileData = async () => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.get(`/api/files/`, chatbotId);
    return response.data;
  } catch (error) {
    console.error("Error fetching chatbot file data:", error);
    return { error: "Failed to retrieve chatbot file data" };
  }
};

export const uploadFile = async (file: File[]) => {
  const userId = USER_ID as string; // Assuming you're using environment variables for user and chatbot IDs
  const chatbotId = CHATBOT_ID as string;

  const formData = new FormData();
  file.forEach((files) => {
    formData.append("FormFiles", files, files.name);
  });
  console.log("fileData", formData, chatbotId, userId)

  try {
    const response = await fetchWrapper.post(`/chats/${chatbotId}/documents`, formData);
    return response.data; // Assuming the API response structure is like { data: ... }
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "File upload failed" };
  }
}

export const removeFile = async (fileId: number, fileName: string) => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.del(`/api/files/`,`${chatbotId}/${fileId}`, fileName);
    return response.data;
  } catch (error) {
    console.error("Error removing file:", error);
    return { error: "File removal failed" };
  }
};

