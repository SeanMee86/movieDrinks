import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { apiKey } from '../../config/apiKey';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  movies: Movie[] = [];
  private movieUrl = `https://www.omdbapi.com/?apikey=${apiKey}&type=movie&s=`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

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
    if (this.movies.length < 1) {
      this.router.navigate(['/movies']);
      return;
    }
    return this.movies.find(movie => movie.id === id);
  }
}
