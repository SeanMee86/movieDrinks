import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Movie } from '../models/movie.model';
import { apiKey } from '../../config/apiKey';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private movieUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=`;
  private movies: Movie[] = [];
  moviesChanged = new Subject<Movie[]>();

  constructor(private http: HttpClient) { }

  findMovie(term: string): void {
    this.http.get<any>(this.movieUrl + term)
      .pipe<Movie[]>(
        map(
        data => data.Search
          .filter((movie) => {
            console.log(movie);
            return movie.Type === 'movie';
          })
          .map((movie) => {
            return {
              title: movie.Title,
              poster: movie.Poster,
              year: movie.Year,
              id: movie.imdbID
            };
          })
        )
      )
      .subscribe(
        data => {
          this.movies = data;
          this.moviesChanged.next(this.movies);
        }
      );
  }

  get getMovies() {
    return this.movies.slice();
  }
}
