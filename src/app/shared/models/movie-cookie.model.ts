import {RuleCookie} from "./rule-cookie.model";

export interface MovieCookie {
  expiration?: number;
  rules?: RuleCookie[]
}
