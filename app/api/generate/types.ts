export interface GenerateRequest {
    topic: string;
  }
  
  export interface OutlineSection {
    section: string;
    keywords: string[];
  }
  
  export interface GenerateResponse {
    success: boolean;
    data?: {
      keywords: string[];
      sections: OutlineSection[];
    };
    error?: string;
  }
  