"use client";
import { useEffect, useState } from "react";
import { FileType2, FolderCog, Globe2Icon, UploadIcon, UserCogIcon } from "lucide-react";
import FileDataGrid from "@/components/FileDataGrid";
import FileUploadComponent from "@/components/FileUploadComponent";
import TabBar from "@/components/TabBar";



const Training = () => {
  const [activeTab, setActiveTab] = useState("file"); 
  return (
    <>
      <TabBar />
      <div className="md:flex px-10">
        {/* Tab navigation */}
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
          <li>
            <button
              className={`inline-flex items-center px-4 gap-2 py-3 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${activeTab === "file" ? "border-r-2 border-blue-700 text-blue-700" : "border-r-2 border-transparent"}`}
              onClick={() => setActiveTab("file")}
            >
              <FolderCog />
              File
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center px-4 py-3 gap-2 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${activeTab === "text" ? "border-r-2 border-blue-700 text-blue-700" : "border-r-2 border-transparent"}`}
              onClick={() => setActiveTab("text")}
            >
              <FileType2 />
              Text
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center px-4 gap-2 py-3 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${activeTab === "website" ? "border-r-2 border-blue-700 text-blue-700" : "border-r-2 border-transparent"}`}
              onClick={() => setActiveTab("website")}
            >
             <Globe2Icon />
              Website
            </button>
          </li>
        </ul>

        {/* Content area */}
        <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
          {activeTab === "file" && (
            <>
              <FileUploadComponent />
              <FileDataGrid />
            </>
          )}
          {activeTab === "text" && (
            <div>
              <h3>Text Content</h3>
            </div>
          )}
          {activeTab === "website" && (
            <div>
              <h3>Website Content</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Training;
