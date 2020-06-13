import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { apiKey } from '../../config/apiKey';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  movies: Movie[] = [];
  private movieUrl = `https://www.omdbapi.com/?apikey=${apiKey}&type=movie&s=`;

  constructor(private http: HttpClient) { }

  findMovie(term: string): Observable<Movie[]> {
    return this.http.get<any>(this.movieUrl + term)
      .pipe<Movie[]>(
        map(data => {
          if (data.Search) {
            this.movies = data.Search
              .map((movie) => {
                return {
                  title: movie.Title,
                  poster: movie.Poster,
                  year: movie.Year,
                  id: movie.imdbID,
                  rules: []
                };
              });
            return this.movies;
          }
        })
      );
  }

  getMovie(id: string) {
    const movieToLoad = this.movies.filter(movie => movie.id === id);
    if (movieToLoad.length === 1) {
      return movieToLoad[0];
    }
  }
}
