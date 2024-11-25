"use client";
import ChatSessionServices from "@/services/chatsession.service";
import SendMessageService from "@/services/sendmessage.service";
import { Bot, Send, User, UserCog2, RefreshCcw } from "lucide-react";
import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { Message } from "@/utils/dtos/DataDto";


const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | undefined>();

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await checkSession();
        if (!currentSessionId) {
          toast.error("Failed to initialize a chat session.");
          setLoading(false);
          return;
        }
      }

      const newMessage: Message = {
        messageId: messages.length + 1,
        username: "Default User",
        content: input,
      };
      setMessages([...messages, newMessage]);
      setInput("");

      // Send message to chatbot
      const response = await SendMessageService.sendChatMessage(
        currentSessionId,
        input
      );
      if (response.success) {
        const botMessage: Message = {
          messageId: response.messageId,
          username: "Bot",
          content: response.content,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.error("Error sending message:", response.message);
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while sending the message.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const resetMessagesDeleteChatSession = async () => {
    const session = await ChatSessionServices.checkSession();
    if (session.exists) {
      await ChatSessionServices.removeSession();
    }
  };

  const resetMessages = async () => {
    await resetMessagesDeleteChatSession();
    window.location.reload();
  };

  const OnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const loadMessageHistory = async () => {
    if (sessionId) {
      const history = await SendMessageService.loadMessageHistory(sessionId);
      if (history && history.success) {
        setMessages(history.message);
      } else {
        console.error("Failed to load message history.");
      }
    }
  };

  useEffect(() => {
      checkSession();
  }, []); 


  useEffect(() => {
    loadMessageHistory();
}, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check or create a session
  const checkSession = async (): Promise<string | undefined> => {
    try {
      const session = await ChatSessionServices.checkSession();
      if (!session.exists) {
        const newSession = await ChatSessionServices.createSession();
        if (newSession.success) {
          setSessionId(newSession.data.sessionId);
          return newSession.data.sessionId;
        } else {
          console.error("Failed to create session:", newSession.message);
          toast.error("Failed to create a session.");
          return undefined;
        }
      } else {
        setSessionId(session.sessionId);
        return session.sessionId;
      }
    } catch (error) {
      console.error("Error checking or creating session:", error);
      toast.error("An error occurred while checking the session.");
      return undefined;
    }
  };

  return (
    <div className="bg-gray-100 h-full w-full flex flex-col max-w-lg mx-auto">
      <div className="bg-teal-600 p-4 text-white flex justify-between items-center">
        <Link href="/manage/training">
          <button className="hover:bg-teal-400 rounded-md p-1">
            <UserCog2 />
          </button>
        </Link>

        <span>MyBot.Chat</span>
        <div className="relative inline-block text-left">
          <button
            id="reset"
            onClick={resetMessages}
            className="hover:bg-teal-400 rounded-md p-1"
          >
            <RefreshCcw />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => {
            if (msg.username === "Bot") {
              return (
                <div key={msg.messageId} className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full border shadow-md p-2">
                      <Bot color="#000000" />
                    </div>
                  </div>
                  <div className="chat-bubble">
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div key={msg.messageId} className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full p-2 bg-slate-500">
                      <User color="#fff" />
                    </div>
                  </div>
                  <div className="chat-bubble">
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  </div>
                </div>
              );
            }
          })}
          {loading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full border shadow-md p-2">
                  <Bot color="#000000" />
                </div>
              </div>
              <div className="chat-bubble bg-gray-300 break-words">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={OnChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          className="bg-teal-600 text-white rounded-full p-2 ml-2 hover:bg-teal-500 focus:outline-none"
          onClick={handleSend}
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
