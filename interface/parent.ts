// types/Parent.ts
export interface Parent {
    id: number; // Assuming id is a number
    name: string;
    email: string;
    contactNumber: string;
  }
  
  export interface ParentResponse {
    status: string;
    message: string;
    data: Parent[];
  }