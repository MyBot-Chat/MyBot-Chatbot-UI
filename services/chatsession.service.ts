import fetchWrapper from "../libs/fetchWrapper";


const createSession = async (): Promise<any> => {
  try {
    const botId = process.env.CHATBOT_ID;
    const body = {
      botid: botId,
    };

    if (!botId) {
      throw new Error("CHATBOT_ID environment variable is not set");
    }

    const response = await fetchWrapper.post('/api/Conversation', body);

    if (response?.sessionId) {
      sessionStorage.setItem('sessionKey', response.sessionId);
    }

    return response;
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

export const ChatSessionServices = {
  createSession,
  checkSession,
};

export default ChatSessionServices;