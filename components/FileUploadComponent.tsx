import { useState, ChangeEvent, DragEvent } from "react";
import Swal from "sweetalert2";
import { getChatbotFileData, uploadFile, removeFile } from "@/services/fileService";
import { UploadIcon } from "lucide-react";

const FileUploadComponent = () => {
  
  return (
    <>
     <div className="flex items-center justify-center w-full py-5">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="m-5"/>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Drag and drop your files here </span> or click to select.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Supported File Types: .pdf, .doc, .docx, .txt, .xlsx, .pptx</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
            </label>
        </div> 
    </>
  );
};

export default FileUploadComponent;
