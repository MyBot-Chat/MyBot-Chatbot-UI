import fetchWrapper from "../libs/fetchWrapper";
import { CHATBOT_ID} from '../utils/config';

const createSession = async (): Promise<any> => {
  try {
    const botId = CHATBOT_ID;
    const body = {
      botid: botId,
    };

    if (!botId) {
      throw new Error("CHATBOT_ID environment variable is not set");
    }

    const response = await fetchWrapper.post('/api/Conversation', body);
    if (response) {
      sessionStorage.setItem('sessionKey', response.sessionId);
    }
    return {
      success: true,
      data: response,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as any)?.response?.data?.message || "Failed to create session",
      details: (error as any)?.response?.data || (error instanceof Error ? error.message : "An unknown error occurred"),
    };
  }
};

const checkSession = (): { exists: boolean; sessionId?: string } => {
  const sessionId = sessionStorage.getItem('sessionKey');

  if (sessionId) {
    return { exists: true, sessionId };
  }

  return { exists: false };
};


const removeSession = (): void => {
  sessionStorage.removeItem('sessionKey');
  console.log("Session key removed from sessionStorage.");
};

export const ChatSessionServices = {
  createSession,
  checkSession,
  removeSession,
};

export default ChatSessionServices;