
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
  
  export type Message = {
    messageId: number;
    username: "Bot" | "Default User";
    content: string;
    imageUrl?: string;
  };