import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  rootURL = 'https://movie-drinks.firebaseio.com';
  loadMovie = new Subject<{[s: string]: Movie}>();

  constructor(private http: HttpClient) { }

  sendData(movie: Movie) {
    return this.http.post<{ name: string; }>(this.rootURL + '/movies.json', movie);
  }

  getMovies() {
    return this.http.get<{[s: string]: Movie}>(this.rootURL + '/movies.json').pipe(
      map(
        data => {
          const fbMoviesArray: {[s: string]: Movie}[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              fbMoviesArray.push({[key]: data[key]});
            }
          }
          return fbMoviesArray;
        }
      )
    );
  }

  getMovie(fbKey: string) {
    this.getMovies().subscribe(
      fbMovies => {
        this.loadMovie.next(fbMovies.find(fbMovie => Object.keys(fbMovie)[0] === fbKey));
      }
    );
  }

  updateMovie(fbKey: string, data: {rules: string[]}) {
    return this.http.patch(this.rootURL + '/movies/' + fbKey + '.json', data);
  }
}
