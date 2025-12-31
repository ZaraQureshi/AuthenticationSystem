export interface UserDTO {
    id?: number;
    username: string;
    password:string;
    email: string;
    role?: string;
    isVerified?: boolean;
    isBlocked?: boolean;
    failedLoginAttempts?: number;
    lockedUntil?: Date|null;
  }

