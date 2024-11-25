import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TrashIcon } from "lucide-react";
import faqService from "@/services/faq.service";
import { ChatbotQandAModel, QAInputModelDto } from "@/utils/dtos/DataDto";

const QAComponent: React.FC = () => {
  const [chatbotQandAlist, setChatbotQandAlist] = useState<ChatbotQandAModel[]>([]);
  const [totalQAChar, setTotalQAChar] = useState(0);

  const fetchChatbotQA = async () => {
    try {
      const result = await faqService.getChatbotQA();
      if (result.success) {
        setChatbotQandAlist(Array.isArray(result.QAData) ? result.QAData : []);
      } else {
        setChatbotQandAlist([]);
      }
    } catch (error) {
      setChatbotQandAlist([]); 
    }
  };

  useEffect(() => {
    fetchChatbotQA();
  }, []);

  useEffect(() => {
    if (chatbotQandAlist.length > 0) {
      const total = chatbotQandAlist.reduce((sum, item) => sum + (item.contentLenght || 0), 0);
      setTotalQAChar(total);
    }
  }, [chatbotQandAlist]);

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
      const newFAQ: QAInputModelDto = {
        Question: formValues.question,
        Answer: formValues.answer,
      };

      try {
        const result = await faqService.uploadChatbotQA(newFAQ);
        if (result) {
          setChatbotQandAlist((prev) => [...prev, result]);
          Swal.fire({
            icon: "success",
            title: "FAQ Added",
            text: "Your FAQ has been added successfully.",
            timer: 2000,
          });
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to upload FAQ. Please try again later.",
        });
      }
    }
  };

  const handleDelete = async (Id: number) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const result = await faqService.removeChatbotQA(Id);
        if (result.status === 200) {
          Swal.fire("Deleted!", "The Q&A has been deleted successfully.", "success");
          await fetchChatbotQA();
        } else {
          throw new Error("Delete failed");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong, please try again later.", "error");
      }
    }
  };

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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Q & A</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
                Content Length
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Trained</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(chatbotQandAlist) && chatbotQandAlist.length > 0 ? (
              chatbotQandAlist.map((faq, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <p className="font-semibold">{faq.question}</p>
                    <p className="text-gray-600">{faq.answer}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <p className="font-semibold">{faq.contentLenght}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent checkbox-md"
                      defaultChecked={faq.isTrained}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QAComponent;
