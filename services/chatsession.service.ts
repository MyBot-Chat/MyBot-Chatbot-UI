import fetchWrapper from "../libs/fetchWrapper";


const createSession = async (): Promise<any> => {
  try {
    const botId = process.env.NEXT_PUBLIC_CHATBOT_ID;
    const sessionId = "d657297a-b060-4fc0-a5d8-66b3fd01bf26";
    const body = {
      botid: botId,
    };

    if (!botId) {
      throw new Error("CHATBOT_ID environment variable is not set");
    }

    const response = await fetchWrapper.post('/api/Conversation', body);

    return {
      success: true,
      data: response,
    };
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