import { Component, OnInit } from '@angular/core';
import {Movie} from "../../shared/models/movie.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MovieService} from "../../shared/services/movie.service";

@Component({
  selector: 'app-loaded-movie',
  templateUrl: './loaded-movie.component.html',
  styleUrls: ['./loaded-movie.component.scss']
})
export class LoadedMovieComponent implements OnInit {
  movie: Movie;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.movieService.movies.length > 0) {
      this.id = this.route.snapshot.params['id'];
      this.movie = this.movieService.getMovie(this.id);
    } else {
      this.router.navigate(['/search']);
    }
  }
}
