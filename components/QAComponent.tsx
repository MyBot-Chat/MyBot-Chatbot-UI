import { Eye, TrashIcon, } from "lucide-react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ChatbotQandAModel {
  Id: number;
  Question: string;
  Answer: string;
  IsTrained: boolean;
  ContentLength: number;
}

const QAComponent: React.FC = () => {
  const [chatbotQandAlist, setChatbotQandAlist] = useState<ChatbotQandAModel[]>([]);
  const [totalQAChar, setTotalQAChar] = useState(0);

  const AddFAQForm = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add FAQ",
      html: `
        <div class="flex flex-col space-y-4">
          <input id="swal-input1" class="swal2-input" placeholder="Enter Question" />
          <textarea id="swal-input2" class="swal2-textarea" placeholder="Enter Answer"></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const question = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const answer = (document.getElementById("swal-input2") as HTMLTextAreaElement).value;

        if (!question || !answer) {
          Swal.showValidationMessage("Both Question and Answer are required!");
        }

        return { question, answer };
      },
    });

    if (formValues) {
      const newFAQ: ChatbotQandAModel = {
        Id: chatbotQandAlist.length + 1,
        Question: formValues.question,
        Answer: formValues.answer,
        IsTrained: false,
        ContentLength: formValues.question.length + formValues.answer.length,
      };

      setChatbotQandAlist((prev) => [...prev, newFAQ]);
    
      console.log("Q", newFAQ);

      Swal.fire({
        icon: "success",
        title: "FAQ Added",
        text: "Your FAQ has been added successfully.",
        timer: 2000,
      });
    }
  };

  const OnViewDetail = (Id: number) => {
    const selectedQA = chatbotQandAlist.find((item) => item.Id === Id);
  
    if (selectedQA) {
      Swal.fire({
        title: `<strong>Q&A Details</strong>`,
        html: `
          <div class="text-left gap-5">
            <p><strong>Question:</strong> ${selectedQA.Question}</p>
            <p><strong>Answer:</strong> ${selectedQA.Answer}</p>
            <p><strong>Trained:</strong> ${selectedQA.IsTrained ? "Yes" : "No"}</p>
            <p><strong>Content Length:</strong> ${selectedQA.ContentLength}</p>
          </div>
        `,
        confirmButtonText: "Close",
        focusConfirm: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to find the selected Q&A.",
      });
    }
  };
  
  const handleDelete = async (Id: number) => {
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
          setChatbotQandAlist((prevList) => prevList.filter((item) => item.Id !== Id));
          Swal.fire('Deleted!', 'The Q&A has been deleted successfully.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong, please try again later.', 'error');
        }
      }      
  };
  

  useEffect(() => {
    const total = chatbotQandAlist.reduce((sum, item) => sum + item.ContentLength, 0);
    setTotalQAChar(total);
  }, [chatbotQandAlist]);

  return (
    <div className="mx-auto p-4 bg-white shadow-lg rounded-md">
      <h4 className="text-xl font-bold mb-4">Q&A</h4>
      <hr className="mb-4" />
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={AddFAQForm}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Total Characters: {totalQAChar}</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
                Q & A
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 tracking-wider">
                Trained
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 tracking-wider">
                Length
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chatbotQandAlist.map((data) => (
              <tr
                key={data.Id}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  <p className="font-semibold">
                    <strong>Q:</strong> {data.Question}
                  </p>
                  <p>
                    <strong>A:</strong> {data.Answer}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  {data.IsTrained ? (
                    <span className="text-green-500 font-semibold">✓</span>
                  ) : (
                    <span className="text-red-500 font-semibold">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">
                  {data.ContentLength}
                </td>
                <td className="px-6 py-4 text-center">
                <button
                    className="bg-gray-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 mr-2"
                    onClick={() => OnViewDetail(data.Id)}
                  >
                    <Eye/>
                  </button>
                  <button
                    className="bg-gray-100 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                    onClick={() => handleDelete(data.Id)}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QAComponent;
