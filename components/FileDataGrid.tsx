"use client";

import  { filesService } from "@/services/files.service";
import formatDate from "@/utils/formatDate";
import { TrashIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";

const FileDataGrid = () => {
  const [fileData, setFileData] = useState<any[]>([]); // Array of files
  const [loading, setLoading] = useState<boolean>(true);

  
  const fetchFileData = async () => {
     setLoading(true);
     const data = await filesService.getChatbotFile();
     if (data && data.success) {
      setFileData(data.filesData);
      }
      setLoading(false);
  }

  useEffect(() => {
    fetchFileData();
  }, []);

  const handleDelete = async (fileId: number) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        const res = await filesService.removeChatbotFile(fileId);
        if (res.status === 200) {
          Swal.fire('Deleted!', 'The file has been deleted successfully.', 'success');
          await fetchFileData();
        } else {
          Swal.fire('Error!', 'Something went wrong, please try again later.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'There was an issue with the request. Please try again later.', 'error');
      }
    } else {
      Swal.fire('Cancelled', 'The file was not deleted.', 'info');
    }
  };  

  if (loading) {
    return <div className="text-center">
              <span className="loading loading-infinity loading-lg"></span>
            </div>;
  }

  return (
    <div className="overflow-x-auto w-full text-center py-5">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-600">
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">File Name</th>
            <th className="px-4 py-2 border-b">Size</th>
            <th className="px-4 py-2 border-b">Trained</th>
            <th className="px-4 py-2 border-b">Created Date</th>
            <th className="px-4 py-2 border-b">Modified Date</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileData.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-2 border-b text-center">No files available</td>
            </tr>
          ) : (
            fileData.map((file, index) => (
              <tr key={file.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{file.fileName}</td>
                <td className="px-4 py-2 border-b">{file.contentLength}</td>
                <td className="px-4 py-2 border-b">
                {file.isTrained ? (
                    <input type="checkbox" readOnly defaultChecked className="checkbox checkbox-accent checkbox-md" />
                  ) : (
                    <input type="checkbox" readOnly  className="checkbox checkbox-accent checkbox-md" />
                )}
                </td>
                <td className="px-4 py-2 border-b">{file.createdDate ? formatDate(file.createdDate) : 'N/A'}</td>
                <td className="px-4 py-2 border-b">{file.modifiedDate ? formatDate(file.modifiedDate) : 'N/A'}</td>
                <td className="px-4 py-2 border-b">
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(file.id)}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileDataGrid;
