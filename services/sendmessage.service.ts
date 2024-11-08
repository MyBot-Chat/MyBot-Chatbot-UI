import fetchWrapper from "../libs/fetchWrapper";
import { CHATBOT_ID} from '../utils/config';


let imageId: string | null = null;
let imageUrl: string | null = null; 

const sendChatMessage = async (sessionId: string, message: string, imageUrl?: string): Promise<any> => {
    const data = {
        botId: CHATBOT_ID,
        sessionId,
        message,
        imageUrl,
    };

    try {
        // Reset image data if an imageUrl is provided
        if (imageUrl) {
            resetImageData();
        }
        const response = await fetchWrapper.post('/api/ChatMessage', data);

        if (response.messageId) {
            return {
                success: true,
                messageId: response.messageId,
                content: response.content,
            };
        } else {
            return {
                success: false,
                message: "No message ID returned.",
            };
        }
    } catch (error: any) {
        return handleSendMessageError(error);
    }
};

const loadMessageHistory = async (sessionId: string): Promise<any> => {
    try {
      const chatbotId = CHATBOT_ID;
      const start = 0;
      const response =  await fetchWrapper.get('/api/ChatMessage', `${chatbotId}/${sessionId}?size=20&start=${start}`)
      if(response.length > 0){
        return {
            success: true,
            message: response,
          }
      }
      else{
        return {
            success: false,
            message: 'No messages found.',
          }
      }
    } catch (error) {
      console.error("Failed to load message history:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
};
const handleSendMessageError = (error: any): { success: boolean; message: string } => {
    const statusCode = error?.response?.status;
    let errorMessage = "An unknown error occurred.";

    switch (statusCode) {
        case 400:
            errorMessage = "Bad Request: Not Found";
            break;
        case 401:
            errorMessage = "Unauthorized: Please log in.";
            break;
        case 403:
            errorMessage = "Forbidden: Account is out of quota.";
            alert("Chat quota reached limit");
            break;
        case 500:
            errorMessage = "Internal Server Error.";
            break;
        default:
            errorMessage = "Unknown error: " + error.message;
    }

    console.error("Send message error:", error);
    return {
        success: false,
        message: errorMessage,
    };
};

const resetImageData = (): void => {
    imageId = null;  // Reset imageId
    imageUrl = null; // Reset imageUrl
};

export const sendmessageService = {
    sendChatMessage,
    loadMessageHistory,
};

export default sendmessageService;