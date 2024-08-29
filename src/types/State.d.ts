import { User } from "./User";
import { Address } from "./Address";
import { Claim } from "./Claim";

export interface State {
  user: User | null;
  addresses: Address[];
  claims: Claim[];
  userError: string;
}