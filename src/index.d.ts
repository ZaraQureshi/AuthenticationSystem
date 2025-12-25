// Type definitions for the AuthenticationSystem npm package

export type SupportedDBType = "postgres" | "mysql" | "mongo";

export interface AuthConfig {
  /**
   * The database type to use.
   */
  dbType: SupportedDBType;

  /**
   * User-provided DB instance (e.g., Drizzle DB).
   */
  db: any;

  /**
   * Secret key for access tokens.
   */
  accessSecret: string;

  /**
   * Secret key for refresh tokens.
   */
  refreshSecret: string;
}

export interface AuthService {
  register: (params: { username: string; email: string; password: string }) => Promise<any>;
  login: (params: { email: string; password: string }) => Promise<any>;
  refreshToken: (refreshToken: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (params: { resetToken: string; password: string }) => Promise<any>;
  verifyEmail: (emailToken: string) => Promise<any>;
  sentEmailVerification: (email: string) => Promise<any>;
  purgeExpiredTokens: (secret: string) => Promise<any>;
  logout: (params: { email: string; refreshToken: string }) => Promise<any>;
  getAllUsers: () => Promise<any>;
  onboardUser: () => Promise<any>;
}

/**
 * Creates an authentication service instance with the provided config.
 */
export function createAuthService(config: AuthConfig): Promise<AuthService>;

/**
 * Exported Drizzle schema for the users table.
 */
export { users } from "./drizzle/schema";
