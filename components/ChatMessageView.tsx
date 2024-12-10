"use client";
import ChatMessageService from "@/services/sendmessage.service";
import { Message } from "@/utils/dtos/DataDto";
import { Bot,  User,} from "lucide-react";
import React, { useState, useEffect } from "react";


interface ChatMessageViewProps {
  sessionId: string;
}

const ChatMessageView: React.FC<ChatMessageViewProps> = ({ sessionId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadMessageHistory = async () => {
        if (sessionId) {
        setLoading(true)
          const history = await ChatMessageService.loadMessageHistory(sessionId);
          if (history && history.success) {
            setMessages(history.message);
            setLoading(false);
          } else {
            console.error("Failed to load message history.");
          }
        }
      };

    useEffect(() => {
        loadMessageHistory();
    }, [sessionId]);

  return (
    <div className="bg-gray-100 h-full w-full flex flex-col max-w-lg mx-auto">
      <div className="bg-teal-600 p-4 text-white  items-center text-center">
        <span className="text-center">MyBot.Chat</span>
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
            <div className="text-center">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageView;
