// components/FileDataGrid.tsx
import { DeleteIcon, TrashIcon } from 'lucide-react';
import React from 'react';

const FileDataGrid: React.FC = () => (
 <>
     <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">File Name</th>
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b">Size</th>
              <th className="px-4 py-2 border-b">Trained</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">1</td>
              <td className="px-4 py-2 border-b">Book</td>
              <td className="px-4 py-2 border-b">xlsx</td>
              <td className="px-4 py-2 border-b">29kb</td>
              <td className="px-4 py-2 border-b">true</td>
              <td className="px-4 py-2 border-b">
                <button className="text-red-500 hover:text-red-700">
                  <TrashIcon />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
 </>
);

export default FileDataGrid;
