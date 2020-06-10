import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../shared/services/movie.service';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent implements OnInit {
  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.movieService.findMovie(form.controls.movieName.value);
  }
}
