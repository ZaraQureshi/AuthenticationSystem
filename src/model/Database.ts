import { TokenDTO } from "./Token";
import { UserDTO } from "./User";

export interface Database {
  users: UserDTO;
  tokens: TokenDTO;
}