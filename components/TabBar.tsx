"use client";

import React, { useEffect, useState } from 'react';
import { ChartNoAxesCombined, HistoryIcon, LogsIcon, SquareChevronRight, UserCogIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'


const TabBar = () => {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (tabIndex: number, url: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tabIndex);
    router.push(url); 
  };

  useEffect(() => {
    if (pathname?.includes('/manage/training')) setActiveTab(1);
    else if (pathname?.includes('/manage/console')) setActiveTab(2);
    else if (pathname?.includes('/manage/chatlog')) setActiveTab(3);
    else if (pathname?.includes('/manage/usage')) setActiveTab(4);
  }, [pathname]);

  return (
    <>
        <div className="border-b border-gray-200 dark:border-gray-700 my-5 mx-5">
        <h1 className="text-3xl font-bold text-center">MyChatBot</h1>
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <button
              className={`inline-flex items-center gap-2 justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 1 ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={(e) => handleTabClick(1, '/manage/training', e)}
            >
              <UserCogIcon />
              Training
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-flex items-center gap-2 justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 2 ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={(e) => handleTabClick(2, '/manage/console', e)}
            >
              <SquareChevronRight />
              Console
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-flex items-center gap-2 justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 3 ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={(e) => handleTabClick(3, '/manage/chatlog', e)}
            >
              <HistoryIcon />
              ChatLog
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-flex items-center gap-2 justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 4 ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={(e) => handleTabClick(4, '/manage/usage', e)}
            >
              <ChartNoAxesCombined />
              Usage
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TabBar;
