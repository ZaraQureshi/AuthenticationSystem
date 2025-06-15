export interface UserDTO {
    id: number;
    username: string;
    password:string;
    email: string;
    role: string;
    isVerified: string;
    isBlocked: boolean;
  }