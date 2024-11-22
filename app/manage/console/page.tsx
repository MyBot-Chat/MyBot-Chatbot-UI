"use client";
import { useState } from "react";
import { UploadIcon, UserCogIcon } from "lucide-react";
import FileDataGrid from "@/components/FileDataGrid";
import FileUploadComponent from "@/components/FileUploadComponent";
import TabBar from "@/components/TabBar";
import Chatbot from "@/components/Chatbot";

const Console = () => {
  return (
    <>
       <TabBar />
       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Chatbot />
        </div>
    </>
  );
};

export default Console;
