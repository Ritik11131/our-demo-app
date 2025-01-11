// types/Crew.ts

export interface CrewMember {
    id: number; // Assuming id is a number
    isPilot: boolean;
    isHelper: boolean;
    isTeacher: boolean;
    licenseNumber: string;
    emergencyContact: string;
    name: string;
    email: string;
    contactNumber: string;
  }
  
  export interface CrewResponse {
    status: string;
    message: string;
    data: CrewMember[];
  }

  export interface CrewPost {
    name: string;
    email: string;
    username: string;
    contactNumber: string;
    address: string;
    isPilot: boolean;
    isHelper: boolean;
    isTeacher: boolean;
    attributes: {
      emergencyContact: string;
      licenseNumber: string;
    };
  }