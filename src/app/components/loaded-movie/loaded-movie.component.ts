import { Component, OnInit } from '@angular/core';
import {Movie} from "../../shared/models/movie.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MovieService} from "../../shared/services/movie.service";
import {ModalService} from "../../shared/services/modal.service";
import {FirebaseService} from "../../shared/services/firebase.service";

@Component({
  selector: 'app-loaded-movie',
  templateUrl: './loaded-movie.component.html',
  styleUrls: ['./loaded-movie.component.scss']
})
export class LoadedMovieComponent implements OnInit {
  movie: Movie;
  id: string;
  showSpinner = true;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private modalService: ModalService,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
    if(this.movieService.movies.length > 0) {
      this.id = this.route.snapshot.params['id'];
      this.movie = this.movieService.getMovie(this.id);
      this.fbService.sendData(this.movie).subscribe(
        response => {
          console.log(response);
          this.showSpinner = false;
        }
      )
    } else {
      this.router.navigate(['/search']);
    }
  }
}
