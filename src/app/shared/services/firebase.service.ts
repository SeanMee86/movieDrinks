import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  rootURL = 'https://movie-drinks.firebaseio.com/';

  constructor(private http: HttpClient) { }

  sendData(movie: Movie) {
    return this.http.post<Movie>(this.rootURL + '/movies.json', movie);
  }

  getMovies() {
    return this.http.get<any>(this.rootURL + '/movies.json').pipe(
      map(
        data => {
          const fbMoviesArray: Movie[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              fbMoviesArray.push({
                id: data[key].id,
                title: data[key].title,
                year: data[key].year,
                poster: data[key].poster
              });
            }
          }
          return fbMoviesArray;
        }
      )
    );
  }
}
