import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../shared/services/movie.service';
import { UiService } from '../../shared/services/ui.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loaded-movie',
  templateUrl: './loaded-movie.component.html',
  styleUrls: ['./loaded-movie.component.scss']
})
export class LoadedMovieComponent implements OnInit, OnDestroy {
  movie: Movie;
  id: string;
  showSpinner = true;
  spinnerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private uiService: UiService,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.spinnerSub = this.uiService.shouldShowSpinner.subscribe(
      value => {
        this.showSpinner = value;
      }
    );
    if (this.movieService.movies.length > 0) {
      this.id = this.route.snapshot.params.id;
      this.fbService.getMovies().subscribe(
        fbMovies => {
          const movie = fbMovies.find(fbMovie => fbMovie.id === this.id);
          if (!movie) {
            this.movie = this.movieService.getMovie(this.id);
            this.uiService.showModal(this.movie);
          } else {
            this.movie = movie;
            this.showSpinner = false;
          }
        }
      );
    } else {
      this.router.navigate(['/search']);
    }
  }

  ngOnDestroy(): void {
    this.spinnerSub.unsubscribe();
  }
}
