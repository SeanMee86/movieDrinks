import { Injectable } from '@angular/core';
import { Movie } from "../models/movie.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  rootURL = 'https://movie-drinks.firebaseio.com/';

  constructor(private http: HttpClient) { }

  sendData(movie: Movie) {
    return this.http.post(this.rootURL + '/movies.json', movie);
  }
}
