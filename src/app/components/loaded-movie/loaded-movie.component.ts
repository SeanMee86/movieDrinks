import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';

import { Subscription } from 'rxjs';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { UiService } from '../../shared/services/ui.service';
import { FirebaseService } from '../../shared/services/firebase.service';

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
  showModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private uiService: UiService,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params.id;
      }
    );
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
        const viewCount = this.movie.viewCount+1
        this.fbService
          .movieViewed(this.movieFBKey, {viewCount})
          .subscribe(value => {
            this.movie.viewCount = value.viewCount
          })
      }
    );
    this.onFindMovie();
  }

  onFindMovie() {
    const movieFromFB = this.fbService.getMovie(this.id);
    if (movieFromFB) {
      this.fbService.loadMovie.next(movieFromFB);
      this.showSpinner = false;
    } else {
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
            this.showModal = true;
          } else {
            this.fbService.loadMovie.next(movie);
            this.showSpinner = false;
          }
        }
      );
    }
  }

  onNewMovie(fbKey: string) {
    this.movieFBKey = fbKey;
    this.showModal = false;
  }

  onAddRule() {
    const updatedRules = this.movie.rules ? [...this.movie.rules, this.newRule] : [this.newRule];
    this.fbService.updateMovie(this.movieFBKey, {rules: updatedRules}).subscribe(
      data => {
        this.movie.rules = data.rules;
        this.rulesArray.push(this.newRule);
        this.newRule = '';
      }
    );
  }

  onRemoveRule(index: number) {
    this.rulesArray.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.spinnerSub.unsubscribe();
    this.loadedMovieSub.unsubscribe();
  }
}
