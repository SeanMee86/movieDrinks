import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../shared/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent implements OnInit {
  movies$: Observable<Movie[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.movies$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.movieService.findMovie(term))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  loadMovie(id: string) {
    this.router.navigate([id], {relativeTo: this.route});
  }
}
