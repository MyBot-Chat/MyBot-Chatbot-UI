import { API_TOKEN, baseUrl, CHATBOT_ID } from "@/utils/config";
import fetchWrapper from "../libs/fetchWrapper";
import { ChatbotWebRequestDeleteDto, ChatbotWebsite } from "@/utils/dtos/DataDto";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const gatAllWebsitelink = async () => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.get(`/api/Training/Website`, chatbotId);
    if (response.total > 0) {
      return {
        success: true,
        Data: response,
      };
    } else {
      return {
        success: false,
        Data: "No messages found.",
      };
    }
  } catch (error) {
    console.error("Error fetching chatbot data:", error);
    return { error: "Failed to retrieve chatbot data" };
  }
};

const fetchSitemap = async (sitemapUrl: string, onStreamUpdate: (message: string) => void) => {
  const serverBaseURL = `${baseUrl}/api/Training/Website/Sitemap/${CHATBOT_ID}`;
  await fetchEventSource(serverBaseURL, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ SitemapUrl: sitemapUrl }),
    async onopen(res) {
      if (res.ok && res.status === 200) {
        onStreamUpdate("Connection Open... ");
      } else if (
        res.status >= 400 &&
        res.status < 500 &&
        res.status !== 429
      ) {
        console.log("Client side error ", res);
      }
    },
    onmessage(msg) {
      if (msg.event === "status") {
        onStreamUpdate(`Status: ${msg.data}`);
      }
      else if (msg.event === "end") {
        onStreamUpdate("Sitemap processing finished.");
        return;
      } else if (msg.event === "failed") {
        onStreamUpdate(`Failed: ${msg.data}`);
      }
    },
    onclose() {
      onStreamUpdate("Connection closed by the server.");
    },
    onerror(err) {
      console.log(`Server error: ${err}`);
    },
  });
};

const fetchCrawl = async (linkUrl: string, crawlAllink: boolean, onStreamUpdate: (message: string) => void) => {
  const serverBaseURL = `${baseUrl}/api/Training/Website/Link/${CHATBOT_ID}`;
  const requestBody = JSON.stringify({
    linkUrl: linkUrl,
    crawlAllOrSingle: crawlAllink,
  });

  await fetchEventSource(serverBaseURL, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: requestBody,
    async onopen(res) {
      if (res.ok && res.status === 200) {
        onStreamUpdate("Connection Open... ");
      } else if (
        res.status >= 400 &&
        res.status < 500 &&
        res.status !== 429
      ) {
        console.log("Client side error ", res);
        return ;
      }
    },
    onmessage(msg) {
      if (msg.event === "status") {
        onStreamUpdate(`Status: ${msg.data}`);
      }
      else if (msg.event === "end") {
        onStreamUpdate("Crawl operation finished.");
        return ;
      } else if (msg.event === "failed") {
        onStreamUpdate(`Failed: ${msg.data}`);
      }
    },
    onclose() {
      onStreamUpdate("Connection closed by the server.");
      return;
    },
    onerror(err) {
      console.log(`Server error: ${err}`);
    },
  });
};

const removeWebLink = async (id: number[], dataList: ChatbotWebsite[]) => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const requestBody: ChatbotWebRequestDeleteDto = {
      idList: id,
      listwebsite: dataList  
    };
    const response = await fetchWrapper.del(`/api/Training/Website/Delete/${chatbotId}`, undefined, requestBody);

    if (response.status === 200) {
      return { status: response.status, message: "Successfully removed website links." };
    } else {
      return { status: response.status, message: "Failed to remove website links." };
    }
  } catch (error) {
    console.error("Error removing link:", error);
    return { error: "Link removal failed" };
  }
};

const updateWebLink = async (id: number, data: string) => {
  try {
    const chatbotId = CHATBOT_ID as string;
    const response = await fetchWrapper.update(`/api/Training/Website/Update/${chatbotId}/${id}`, data);

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

export const webService = {
  fetchSitemap,
  fetchCrawl,
  gatAllWebsitelink,
  removeWebLink,
  updateWebLink,
};

export default webService;
