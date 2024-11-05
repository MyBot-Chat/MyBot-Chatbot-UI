"use client";
import  ChatSessionServices from "@/services/chatsession.service";
import  SendMessageService from "@/services/sendmessage.service";
import { Bot, RefreshCcw, Send, User } from "lucide-react";
import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Toaster, toast } from 'sonner'

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | undefined>();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);


    // Send the message using SendMessageService
    try {
      const response = await SendMessageService.sendChatMessage(sessionId!, input);
      setLoading(false); 

      if (response.success) {
        const botMessage: Message = {
          id: messages.length + 2,
          sender: "bot",
          text: response.content,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        toast.success("Message sent successfully!");
      } else {
        console.error("Error sending message:", response.message);
        toast.error("Failed to send message."); 
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error("An error occurred while sending the message.");
    }

  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const resetMessages = () => {
    setMessages([]);
  };

  const OnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check or create a session 
  const checkSession = async () => {
    const session = await ChatSessionServices.checkSession();
    if (!session.exists) {
      const newSession = await ChatSessionServices.createSession();
      // if (newSession && newSession.sessionId) {
      //   setSessionId(newSession.sessionId);
      // }
    } else {
      setSessionId(session.sessionId);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div className="bg-gray-100 h-full w-full flex flex-col max-w-lg mx-auto">
      <div className="bg-teal-600 p-4 text-white flex justify-between items-center">
        <button className="hover:bg-teal-400 rounded-md p-1">
          <User />
        </button>
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
          {messages.map((msg) => (
            <div key={msg.id} className={`chat ${msg.sender === "bot" ? "chat-start" : "chat-end"}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full p-2 bg-slate-500">
                  {msg.sender === "bot" ? <Bot color="#000000" /> : <User color="#fff" />}
                </div>
              </div>
              <div className="chat-bubble bg-gray-300 break-words">
                <p className="text-gray-900">{msg.text}</p>
              </div>
            </div>
          ))}
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

export default Chatbot