import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Movie } from '../models/movie.model';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  rootURL = 'https://movie-drinks.firebaseio.com';
  loadMovie = new Subject<{[s: string]: Movie}>();
  moviesLoaded = new Subject<{[s: string]: Movie}[]>();
  filteredMovies = new Subject<{[s: string]: Movie}[]>();
  fbMovies: {[s: string]: Movie}[] = [];

  constructor(private http: HttpClient) { }

  sendData(movie: Movie) {
    return this.http.post<{ name: string; }>(this.rootURL + '/movies.json', movie)
      .pipe(
        tap(
          fbKey => {
            this.fbMovies.push({
              [fbKey.name]: {...movie}
            });
          }
        )
      );
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
      ),
      tap(
        fbMoviesArray => {
          this.fbMovies = fbMoviesArray;
          this.moviesLoaded.next(this.fbMovies);
        }
      )
    );
  }

  getMovie(id: string) {
    return this.fbMovies.find(fbMovie => {
      for (const key in fbMovie) {
        if (fbMovie.hasOwnProperty(key)) {
          return fbMovie[key].id === id;
        }
      }
    });
  }

  updateMovie(fbKey: string, data: {rules: string[]}) {
    return this.http.patch<{rules: string[]}>(`${this.rootURL}/movies/${fbKey}.json`, data);
  }

  filterMovies(filter: string){
    const filteredMovies = this.fbMovies.filter(movie => movie[Object.keys(movie)[0]].category === filter)
    this.filteredMovies.next(filteredMovies);
  }

  clearFilter(){
    this.filteredMovies
      .next(
        this.fbMovies
          .sort((a, b) => a[Object.keys(a)[0]].title > b[Object.keys(b)[0]].title ? 1 : -1)
      );
  }
}
