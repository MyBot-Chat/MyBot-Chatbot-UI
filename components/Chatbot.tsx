"use client";
import { Bot, User } from "lucide-react";
import { useState , KeyboardEvent} from "react";

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    };
    setMessages([...messages, newMessage]);
    setInput("");

    setTimeout(() => {
      const botReply: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: input,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="w-full h-full md:max-w-md md:h-auto bg-white rounded-lg shadow-md p-4 flex flex-col">
        <h3 className="text-xl font-semibold text-center mb-4">Chatbot</h3>
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => {
            if (msg.sender === "bot") {
              // Bot message 
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <Bot /> {msg.text}
                  </div>
                </div>
              );
            } else {
              // User message 
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="flex items-center gap-2">
                  {msg.text}
                  <User size={36} /> 
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
