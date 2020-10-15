import { Injectable } from '@angular/core';
import { Rule } from "../models/rule.model";
import { MovieCookie } from "../models/movie-cookie.model";

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  buildMovieCookie(rulesArray: Rule[]): MovieCookie {
    return {
      expiration: null,
      rules: rulesArray.map(() => {
        return {
          hasFlagged: false,
          hasVoted: false,
          vote: null
        }
      })
    };
  }

  getMovieCookie(id: string): MovieCookie{
    return JSON.parse(localStorage.getItem(id));
  }

  setMovieCookie(id: string, cookie: MovieCookie){
    localStorage.setItem(id, JSON.stringify(cookie));
  }
}
