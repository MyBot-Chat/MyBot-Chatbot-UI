import FileDataGrid from "@/components/FileDataGrid";
import FileUploadComponent from "@/components/FileUploadComponent";
import { UploadIcon } from "lucide-react";


const Training = () => {
  return (
    <div style={{ display: "grid", justifyContent: "center", alignItems: "center", height: "50vh" }}>  
        <FileUploadComponent />
        <FileDataGrid />
    </div>
  );
};

export default Training;
