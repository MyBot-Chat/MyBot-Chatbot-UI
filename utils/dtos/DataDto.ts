
export interface ChatbotQandAModel {
    id: number;
    question: string;
    answer: string;
    isTrained: boolean;
    contentLenght: number;
    createdDate?: string;
    modifiedDate?: string;
  }
  
  export interface QAInputModelDto {
    Question: string;
    Answer: string;
    ContentLength?: number; 
    CreatedDate?: string;
    ModifiedDate?: string;
  }

  export interface QAInputDto {
    Question: string;
    Answer: string;
  }
  
  export type Message = {
    messageId: number;
    username: "Bot" | "Default User";
    content: string;
    imageUrl?: string;
  };

  export type ChatbotWebsite = {
    id: number;
    chatbotId?: string;
    userId: string;
    url: string;
    content: string;
    contentLength: number;
    istrained: boolean;
    docId: string;
    createdDate: Date;  
    modifiedDate: Date;
};

export interface ChatbotWebRequestDeleteDto {
  idList: number[];  
  listwebsite: ChatbotWebsite[];  
}
