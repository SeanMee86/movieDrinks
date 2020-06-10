import {Component, OnDestroy, OnInit} from '@angular/core';
import { Movie } from '../../../shared/models/movie.model';
import {Subscription} from 'rxjs';
import {MovieService} from '../../../shared/services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy {

  movies: Movie[] = [];
  private movieSub: Subscription;

  constructor(private movieService: MovieService) {
  }

  ngOnInit(): void {
    this.movies = this.movieService.getMovies;
    this.movieSub = this.movieService.moviesChanged.subscribe(
      (movies: Movie[]) => {
        this.movies = movies;
      }
    );
  }

  ngOnDestroy(): void {
    this.movieSub.unsubscribe();
  }
}
