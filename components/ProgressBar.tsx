import { useState, useEffect } from 'react';

interface ProgressBarProps {
  duration: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration }) => {
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  
  useEffect(() => {
    const incrementTime = 100;
    const totalIncrements = duration / incrementTime;
    const incrementStep = 100 / totalIncrements;

    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval); 
          return 100;
        }
        return Math.min(prev + incrementStep, 100);
      });
    }, incrementTime);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-700 dark:text-white">Uploading...</span>
        <span className="text-sm font-medium text-blue-700 dark:text-white">{Math.round(currentProgress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${currentProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
