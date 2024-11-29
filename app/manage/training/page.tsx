"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FolderCog, Globe2Icon, MessageCircleQuestionIcon } from "lucide-react";
import FileDataGrid from "@/components/FileDataGrid";
import FileUploadComponent from "@/components/FileUploadComponent";
import TabBar from "@/components/TabBar";
import QAComponent from "@/components/QAComponent";
import Website from "@/components/Website";

type Tab = "file" | "qa" | "website";

const Training: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("file");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get("tab") as Tab;
      if (tab) {
        setActiveTab(tab);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.replace(`?tab=${tab}`); 
  };

  if (isLoading) {
    return null;
  }
  return (
    <>
      <TabBar />
      <div className="md:flex px-10">
        {/* Tab navigation */}
        <ul className="flex-column space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
          <li>
            <button
              className={`inline-flex items-center px-4 gap-2 py-3 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                activeTab === "file"
                  ? "border-r-2 border-blue-700 text-blue-700"
                  : "border-r-2 border-transparent"
              }`}
              onClick={() => handleTabChange("file")}
            >
              <FolderCog />
              File
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center px-4 py-3 gap-2 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                activeTab === "qa"
                  ? "border-r-2 border-blue-700 text-blue-700"
                  : "border-r-2 border-transparent"
              }`}
              onClick={() => handleTabChange("qa")}
            >
              <MessageCircleQuestionIcon />
              Q&A
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center px-4 gap-2 py-3 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                activeTab === "website"
                  ? "border-r-2 border-blue-700 text-blue-700"
                  : "border-r-2 border-transparent"
              }`}
              onClick={() => handleTabChange("website")}
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
          {activeTab === "qa" && (
            <div>
              <QAComponent />
            </div>
          )}
          {activeTab === "website" && (
            <div>
              <Website />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Training;
