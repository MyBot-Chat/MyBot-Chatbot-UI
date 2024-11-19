import { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { UploadIcon } from "lucide-react";
import { trainingService } from "@/services/training.service";
import ProgressBar from "@/components/ProgressBar";
const FileUploadComponent = () => {
  const allowedTypes = [".pdf", ".doc", ".docx", ".txt", ".xlsx", ".pptx"];
  const [startProgress, setStartProgress] = useState(false);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setStartProgress(true)

    try {
      const response = await trainingService.uploadChatbotFile(formData); 
      if (response) {
        Swal.fire("Upload Complete", "File has been uploaded successfully!", "success");
      } else {
        Swal.fire("Upload Error", response.error, "error");
      }

    } catch (error) {
      Swal.fire("Upload Error", "An error occurred during upload.", "error");
    } finally {
      setStartProgress(false)
    }
  };

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      
      // Validate file type
      if (fileExtension && allowedTypes.includes(`.${fileExtension}`)) {
        handleFileUpload(file);
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
          onChange={handleSelectFile}
        />
      </label>
    </div>
     {startProgress && (
        <ProgressBar  duration={10000} />
      )}
    </>
  );
};

export default FileUploadComponent;
