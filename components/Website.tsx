import { useEffect, useState } from "react";
import { ChatbotWebsite } from "@/utils/dtos/DataDto";
import { webService } from "@/services/web.service";
import Swal from "sweetalert2";
import { EditIcon } from "lucide-react";
import Pagination from "./Pagination";

const CrawlerPage: React.FC = () => {
  const [urlcrawl, setUrlcrawl] = useState<string>("");
  const [urlsitemap, setUrlsitemap] = useState<string>("");
  const [textChangedForcrawl, setTextChangedForcrawl] = useState<boolean>(false);
  const [textChangedForsitemap, setTextChangedForsitemap] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [crawlAllLinks, setCrawlAllLinks] = useState<boolean>(true);
  const [chatbotWebsites, setChatbotWebsites] = useState<ChatbotWebsite[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedData, setSelectedDatas] = useState<ChatbotWebsite[]>([]);
  const [totalContentLength, setTotalContentLength] = useState<number>(0);
  const [logMessages, setLogMessages] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const onStreamUpdate = (message: string) => {
    setLogMessages(message);
  };

  const handleUpdateContent = async (id: number, content: string) => {
    const { value: newContent } = await Swal.fire({
      title: 'Edit Content',
      input: 'textarea',
      inputValue: content,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      width: '800px',
      heightAuto: false,
      inputPlaceholder: 'Enter new content...',
      inputAttributes: {
        'aria-label': 'Type your content here',
        style: 'height: 500px; '
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Content cannot be empty';
        }
      },
      customClass: {
        input: 'swal2-textarea'
      },
      didOpen: () => {
        const inputElement = Swal.getInput() as unknown as HTMLTextAreaElement;
        const confirmButton = Swal.getConfirmButton() as HTMLButtonElement;
        confirmButton.disabled = true;
  
        inputElement.addEventListener('input', () => {
          confirmButton.disabled = false;
        });
      },
    });
   
    if (newContent) {
      await sendUpdateContent(id, newContent);
    } else {
      console.log('No content updated');
    }
  };  
  
 const  sendUpdateContent = async (id: number, content:string) => {
    setIsLoading(true);
    try {
       await webService.updateWebLink(id, content);
       Swal.fire('Update!', 'The content has been update successfully.', 'success');
       await loadData();
    } catch (error) {
      console.error("Error for update content:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelect = (id: number, data: any) => {
    setSelectedDatas((prevSelectedDatas) => {
      if (!Array.isArray(data)) {
        return [...prevSelectedDatas, data];
      } else {
        return [...prevSelectedDatas, ...data];
      }
    });
    
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === chatbotWebsites.length) {
      setSelectedIds([]); 
    } else {
      setSelectedIds(chatbotWebsites.map(site => site.id));
      setSelectedDatas(chatbotWebsites);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire('Missing', 'Please select items to delete.', 'info');
      return;
    }

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
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while we process your request.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

        const res = await webService.removeWebLink(selectedIds, selectedData);

        Swal.close();

        if (res.status === 200) {
          Swal.fire('Deleted!', 'The link has been deleted successfully.', 'success');
          window.location.reload();
        } else {
          Swal.fire('Error!', 'Something went wrong, please try again later.', 'error');
        }
      } catch (error) {
        Swal.close();
        Swal.fire('Error!', 'There was an issue with the request. Please try again later.', 'error');
      }
    } else {
      Swal.fire('Cancelled', 'The link was not deleted.', 'info');
    }
  };
 

  const handleCrawlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlcrawl(e.target.value);
    setTextChangedForcrawl(value.length > 0);
  };

   const handleSitemapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlsitemap(e.target.value);
    setTextChangedForsitemap(value.length > 0);
  };

  const fetchLinks = async (): Promise<void> => {
    setIsLoading(true);
    try {
       await webService.fetchCrawl(urlcrawl, crawlAllLinks, onStreamUpdate);
       await loadData();
    } catch (error) {
      console.error("Error during crawling:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSitemap = async (): Promise<void> => {
    setIsLoading(true);
    try {
        await webService.fetchSitemap(urlsitemap, onStreamUpdate);
        await loadData();
    } catch (error) {
      console.error("Error during sitemap loading:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await webService.gatAllWebsitelink();
      if (response.success) {
        const data = response.Data?.data;
        if (Array.isArray(data)) {
          setChatbotWebsites(data);
  
          const totalLength = data.reduce(
            (sum: number, site: ChatbotWebsite) => sum + (site.contentLength || 0),
            0
          );
          setTotalContentLength(totalLength);
        } else {
          console.error("Expected data to be an array, got:", data);
        }
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error during loading:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  useEffect(() => {
    loadData();
  }, []);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chatbotWebsites.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = async (pageNumber: number) =>  {
   setCurrentPage(pageNumber);
  } 

  return (
    <div className="container mx-auto mt-5">
      <div className="bg-white shadow rounded-lg p-5">
        {/* Crawl Section */}
        <div className="border rounded p-3 cursor-pointer">
          <p className="mt-3">Crawl</p>
          <div className="flex gap-3">
            <input
              type="url"
              className="w-full p-2 border rounded"
              placeholder="https://www.example.com"
              value={urlcrawl}
              onChange={handleCrawlChange}
            />
            <button
              className={`whitespace-nowrap px-4 py-2 text-white bg-gray-700 rounded ${
                !textChangedForcrawl || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={fetchLinks}
              disabled={!textChangedForcrawl || isLoading}
            >
              Fetch Link
            </button>
          </div>
          <div className="mt-3">
            <label className="block mb-2">
              <input
                type="radio"
                className="mr-2"
                checked={crawlAllLinks}
                onChange={() => setCrawlAllLinks(true)}
              />
              <b>All links:</b> extract content from a given link, find more links and extract all contents
            </label>
            <label className="block">
              <input
                type="radio"
                className="mr-2"
                checked={!crawlAllLinks}
                onChange={() => setCrawlAllLinks(false)}
              />
              <b>Single link:</b> only extract content from a given link
            </label>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-between my-5">
          <div className="border-t w-full"></div>
          <span className="px-2">OR</span>
          <div className="border-t w-full"></div>
        </div>

        {/* Sitemap Section */}
        <div>
          <p className="mt-3">Sitemap</p>
          <div className="flex gap-3">
            <input
              type="url"
              className="w-full p-2 border rounded"
              placeholder="https://www.example.com/sitemap.xml"
              value={urlsitemap}
              onChange={handleSitemapChange}
            />
            <button
              className={`whitespace-nowrap px-4 py-2 text-white bg-gray-700 rounded ${
                !textChangedForsitemap || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={loadSitemap}
              disabled={!textChangedForsitemap || isLoading}
            >
              Load Sitemap
            </button>
          </div>
        </div>

        {/* Included Links Section */}
        <div className="flex items-center justify-between mt-10">
          <div className="border-t w-full"></div>
          <div className="text-center w-1/2">Included Links</div>
          <div className="border-t w-full"></div>
        </div>

        {/* Progress Indicators */}
        <div className="text-center mt-5">
          {isLoading && (
            <div className="flex justify-center">
                  {logMessages}
            </div>
          )}
        </div>
        <div className="mt-5">
          <h4 className="text-xl font-bold">Total Content Length: {totalContentLength}</h4>
        </div>

        {/* Chatbot Websites Table */}
        {chatbotWebsites.length > 0 && (
          <div className="mt-5 overflow-x-auto">
            <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <label>
                          <input 
                            type="checkbox" 
                            className="checkbox"
                            checked={selectedIds.length === chatbotWebsites.length}
                            onChange={handleSelectAll}
                          />
                        </label>
                      </th>
                      <th>Url</th>
                      <th>Length</th>
                      <th>Trained</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((site, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedIds.includes(site.id)}
                            onChange={() => handleSelect(site.id, site)}
                          />
                        </td>
                        <td>
                          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            {site.url}
                          </a>
                        </td>
                        <td>{site.contentLength}</td>
                        <td>
                          {site.istrained ? (
                          <input 
                            type="checkbox" 
                            readOnly 
                            checked={site.istrained} 
                            className="checkbox-accent checkbox-md checkbox pointer-events-none" 
                          />
                        ) : (
                          <input 
                            type="checkbox" 
                            readOnly 
                            checked={site.istrained} 
                            className="checkbox-accent checkbox-md checkbox pointer-events-none" 
                          />
                        )}
                        </td>
                        <td>
                          <button
                            className="text-blue-500"
                            onClick={() => handleUpdateContent(site.id, site.content)}
                          >
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                <div className="text-center">
                  <button className="btn btn-error text-white btn-outline " onClick={handleDelete}>Delete Selected Row</button>
                </div>
              </div>
               {/* Pagination */}
               <div className="join mt-5">
                   <Pagination
                      totalItems={chatbotWebsites.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
              </div>
          </div>
        )}
        {chatbotWebsites.length === 0 && (
          <div className="text-center">
            No data
          </div>
        )}
        <p className="mt-5 text-gray-600">
          <strong>Note:</strong> Crawler skips pages with content length less than 150 characters.
        </p>
      </div>
    </div>
  );
};

export default CrawlerPage;
