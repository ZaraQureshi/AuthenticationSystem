export interface TokenDTO {
    id?: number;
    userId: number;
    token: string;
    available: boolean;
    blocked: boolean;
    expiryDate: string;  // you can change this to Date if stored as ISO
    createdAt: string;
    updatedAt: string;
  }
  