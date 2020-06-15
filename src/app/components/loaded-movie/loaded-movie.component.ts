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
  movieFBKey: string;
  id: string;
  showSpinner = true;
  spinnerSub: Subscription;
  loadedMovieSub: Subscription;
  newRule: string;
  rulesArray: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private uiService: UiService,
    private fbService: FirebaseService
  ) {
    this.spinnerSub = this.uiService.shouldShowSpinner.subscribe(
      value => {
        this.showSpinner = value;
      }
    );

    this.loadedMovieSub = this.fbService.loadMovie.subscribe(
      value => {
        this.movie = value[Object.keys(value)[0]];
        this.movieFBKey = Object.keys(value)[0];
        if (this.movie.rules) {
          this.rulesArray = [...this.movie.rules];
        }
      }
    );
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.fbService.getMovies().subscribe(
      fbMovies => {
        const movie = fbMovies.find(fbMovie => {
          for (const key in fbMovie) {
            if (fbMovie[key].id === this.id) {
              return fbMovie;
            }
          }
        });
        if (!movie) {
          this.movie = this.movieService.getMovie(this.id);
          this.uiService.showModal(this.movie);
        } else {
          this.fbService.loadMovie.next(movie);
          this.showSpinner = false;
        }
      }
    );
  }

  onAddRule() {
    const updatedRules = [...this.rulesArray, this.newRule];
    this.fbService.updateMovie(this.movieFBKey, {rules: updatedRules}).subscribe(
      _ => {
        this.rulesArray.push(this.newRule);
        this.newRule = '';
      }
    );
  }

  removeRule(index: number) {
    this.rulesArray.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.spinnerSub.unsubscribe();
    this.loadedMovieSub.unsubscribe();
  }
}
