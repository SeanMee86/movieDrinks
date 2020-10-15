import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Params
} from '@angular/router';

import { Subscription } from 'rxjs';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { UiService } from '../../shared/services/ui.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Rule } from '../../shared/models/rule.model'
import { MovieCookie  } from "../../shared/models/movie-cookie.model";
import { CookieService } from "../../shared/services/cookie.service";

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
  newRule: Rule = {rule: '', rating: 0};
  rulesArray: Rule[] = [];
  showModal = false;
  userInfo: MovieCookie;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private uiService: UiService,
    private fbService: FirebaseService,
    private cs: CookieService
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
        window.scrollTo(0,0);
        this.movie = value[Object.keys(value)[0]];
        this.movieFBKey = Object.keys(value)[0];
        this.userInfo = this.cs.getMovieCookie(this.movieFBKey);
        if (this.movie.rules) {
          this.rulesArray = [...this.movie.rules];
        }
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
    if(this.userInfo) {
      this.userInfo.rules.push({hasFlagged: false, hasVoted: false, vote: null});
      this.cs.setMovieCookie(this.movieFBKey, this.userInfo);
    }
    this.fbService.updateMovie(this.movieFBKey, {rules: updatedRules}).subscribe(
      data => {
        this.movie.rules = data.rules;
        this.rulesArray.push(this.newRule);
        this.newRule = {rule: '', rating: 0};
      }
    );
  }

  onWatchMovie(){
    let viewCount = this.movie.viewCount;
    this.userInfo = this.cs.getMovieCookie(this.movieFBKey);
    if(!this.userInfo){
      this.userInfo = this.cs.buildMovieCookie(this.rulesArray)
    }
    if(this.userInfo.expiration && this.userInfo.expiration > Date.now()) {
      alert('You can only watch so many movies')
    }else {
      this.fbService
        .movieViewed(this.movieFBKey, {viewCount: ++viewCount})
        .subscribe(value => {
          this.movie.viewCount = value.viewCount
          this.userInfo.expiration = Date.now() + 120000
          this.cs.setMovieCookie(this.movieFBKey, this.userInfo)
        })
    }
  }

  ngOnDestroy(): void {
    this.spinnerSub.unsubscribe();
    this.loadedMovieSub.unsubscribe();
  }
}
