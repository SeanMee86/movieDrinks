import {RuleCookie} from "./rule-cookie.model";

export interface Cookie {
  expiration?: number;
  rules?: RuleCookie[]
}
