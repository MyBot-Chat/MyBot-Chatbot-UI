"use client";
import { ChatSession } from "@/utils/dtos/DataDto";
import React, { useState, useEffect } from "react";
import ChatMessageView from "./ChatMessageView";
import { ChatbotServices } from "@/services/chatbot.service";
import convertUtcDateTimeToLocalDateTime from "@/utils/convertUtcDateTimeToLocalDateTime";
import {  Check } from "lucide-react";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;

const ChatLog: React.FC = () => {
  const [chatSessionList, setChatSessionList] = useState<ChatSession[]>([]);
  const [displayedSessions, setDisplayedSessions] = useState<ChatSession[]>([]);
  const [selectedChatSession, setSelectedChatSession] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [startIdx, setStartIdx] = useState(0);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const getChatbotSession = async () => {
    setLoading(true);
    const start = 0;
    const size = 100;
    const allSession = await ChatbotServices.getAllSession(start, size);
    if(allSession.status === 200){
      setChatSessionList(allSession.data);
      setDisplayedSessions(allSession.data.slice(0, ITEMS_PER_PAGE));
      setSelectedChatSession(allSession.data[0].id);
    }
    setLoading(false);
  };
   
  const clearFilter = async () => {
    if (startDate && endDate) {
      (document.getElementById("datepicker-range-start") as HTMLInputElement).value = "";
      (document.getElementById("datepicker-range-end") as HTMLInputElement).value = "";
      await getChatbotSession();
    } else {
      Swal.fire(
        "Before Clear!",
        "Please select both start date and end date.",
        "warning"
      );
    }
  };
  
  const filterSessionsByDate = async () => {
    const start = 0;
    const size = 100;
    if (startDate && endDate ) {
        if (new Date(startDate) >= new Date(endDate)) {
            Swal.fire(
                "Warning!",
                "Start date should be earlier than the end date. Please adjust your selection.",
                "warning"
            );
            return;
        }

        try {
            const filteredSessions = await ChatbotServices.getAllSession(start, size, startDate, endDate);
            if (filteredSessions.status === 200) {
                setChatSessionList(filteredSessions.data);
                setDisplayedSessions(filteredSessions.data.slice(0, ITEMS_PER_PAGE));
                setSelectedChatSession(filteredSessions.data[0]?.id);
            } else {
                Swal.fire(
                    "Error!",
                    `Failed to retrieve sessions: ${filteredSessions.message}`,
                    "error"
                );
            }
        } catch (error: any) {
            Swal.fire(
                "Error!",
                "An unexpected error occurred while fetching sessions. Please try again later.",
                "error"
            );
        }
    } else {
        Swal.fire(
            "Please!",
            "Please select both start date and end date.",
            "warning"
        );
    }
};

  useEffect(() => {
    getChatbotSession();
  }, []);

  const GetMessage = (sessionId: string) =>{
    setSelectedChatSession(sessionId)
  }
  const showPreviousSessions = () => {
    const newStartIdx = Math.max(startIdx - ITEMS_PER_PAGE, 0);
    setStartIdx(newStartIdx);
    setDisplayedSessions(chatSessionList.slice(newStartIdx, newStartIdx + ITEMS_PER_PAGE));
  };

  const showNextSessions = () => {
    const newStartIdx = startIdx + ITEMS_PER_PAGE;
    if (newStartIdx < chatSessionList.length) {
      setStartIdx(newStartIdx);
      setDisplayedSessions(chatSessionList.slice(newStartIdx, newStartIdx + ITEMS_PER_PAGE));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center py-5">
        <div className="relative flex items-center">
          <label className="w-full px-3">Filter From:</label>
          <input 
            id="datepicker-range-start" 
            name="start" 
            type="date" 
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start"/>
        </div>
        <span className="mx-4 text-gray-500">to</span>
        <div className="relative">
          <input 
            id="datepicker-range-end" 
            name="end" 
            type="date" 
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end"/>
      </div>
      <div className="relative px-4">
        <button 
          type="button" 
          disabled={displayedSessions.length < 0 ? true : false}
          onClick={filterSessionsByDate}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
      </div>
      <div className="relative">
        <button 
          type="button" 
          onClick={clearFilter}
          className="text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center  dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Clear</button>
      </div>
    </div>
    {loading ? (
      <div className="text-center">
        <span className="loading loading-infinity loading-lg"></span>
    </div>
    ): (
      displayedSessions.length > 0 ? (
        <div>
          <div className="flex flex-row">
              {/* Sidebar for Sessions */}
              <div className="w-1/3 border-r border-gray-300 p-4 text-left py-3">
                {displayedSessions.map((session) => (
                  <div key={session.id}
                      className={`p-4 cursor-pointer flex justify-between ${
                        selectedChatSession === session.id ? "bg-gray-200" : "bg-transparent"
                      }`}
                      onClick={() => GetMessage(session.id)}
                      >
                      <div>
                        <div className="text-sm font-medium"><strong>{convertUtcDateTimeToLocalDateTime(session.createdOn)}</strong> ,  Message: {session.totalMessage}</div>
                        <div>
                          <strong>Q : </strong>
                          {session.lastQuestion}
                        </div>
                        <div>
                          <strong>A : </strong>
                          {session.lastMessage}
                        </div>
                      </div>
                      <div>
                        {selectedChatSession === session.id && <Check />}
                      </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                  {startIdx > 0 && (
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-sm font-medium py-1 px-3 rounded"
                      onClick={showPreviousSessions}
                    >
                      Previous
                    </button>
                  )}
                  {chatSessionList.length > startIdx + ITEMS_PER_PAGE && (
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-sm font-medium py-1 px-3 rounded"
                      onClick={showNextSessions}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
          
              {/* Chat Messages */}
              <div className="w-2/3 p-4">
                <ChatMessageView sessionId={selectedChatSession} />
              </div>
          </div>
        </div>
      ): (
        <div className="text-center">
            No data chathistory
        </div>
      )
    )}
    </div>
  );
};

export default ChatLog;
