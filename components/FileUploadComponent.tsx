"use client";
import { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { UploadIcon } from "lucide-react";
import  { trainingService } from "@/services/training.service";

const FileUploadComponent = () => {
  const allowedTypes = [".pdf", ".doc", ".docx", ".txt", ".xlsx", ".pptx"];
  const [selectedFiles, setSelectedFiles] = useState<FormData>();
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (files: FormData) => {
    try {
      const response = await trainingService.uploadChatbotFile(files);
      if (response.error) {
        Swal.fire("Upload Error", response.error, "error");
      } else {
        Swal.fire("Upload Complete", "Files have been uploaded successfully!", "success");
      }
      setProgress(100);
    } catch (error) {
      Swal.fire("Upload Error", "An error occurred during upload.", "error");
    } finally {
      setProgress(0);
    }
  };

const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
    if (fileExtension && allowedTypes.includes(`.${fileExtension}`)) {
      const formData = new FormData();
      formData.append("file", file);

      Swal.fire({
        title: "Uploading File",
        html: `
          <p class="text-center mt-2 text-xs text-gray-600"></p>
          <div class='w-full'>
            <div class='h-1.5 w-full bg-pink-100 overflow-hidden'>
              <div class='progress w-full h-full bg-pink-500 left-right'></div>
            </div>
          </div>
        `,
        showConfirmButton: false,
        willOpen: () => {
          setProgress(0);
          handleFileUpload(formData);
        },
        didClose: () => {
          setProgress(0);
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: `Only the following file types are allowed: ${allowedTypes.join(", ")}`,
      });
    }
  }
};

  return (
    <>
      <div className="items-center">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="m-5" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Drag and drop your files here</span> or click to select.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supported File Types: .pdf, .doc, .docx, .txt, .xlsx, .pptx
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            onChange={handleSelectFile}
          />
        </label>
      </div>
    </>
  );
};

export default FileUploadComponent;
