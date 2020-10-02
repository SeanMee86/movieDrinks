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
import {
  faFlag,
  faThumbsDown,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";
import { Email } from '../../../assets/smtp';
import { Rule } from '../../shared/models/rule.model'
import { password } from "../../config/elasticEmailPassword";
import {Cookie} from "../../shared/models/cookie.model";

@Component({
  selector: 'app-loaded-movie',
  templateUrl: './loaded-movie.component.html',
  styleUrls: ['./loaded-movie.component.scss']
})
export class LoadedMovieComponent implements OnInit, OnDestroy {
  faFlag = faFlag;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  movie: Movie;
  movieFBKey: string;
  id: string;
  showSpinner = true;
  spinnerSub: Subscription;
  loadedMovieSub: Subscription;
  newRule: Rule = {rule: '', rating: 0};
  rulesArray: Rule[] = [];
  showModal = false;
  userInfo: Cookie;

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
        this.userInfo = this.getCookie(this.movieFBKey);
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
      this.setCookie(this.movieFBKey, this.userInfo);
    }
    this.fbService.updateMovie(this.movieFBKey, {rules: updatedRules}).subscribe(
      data => {
        this.movie.rules = data.rules;
        this.rulesArray.push(this.newRule);
        this.newRule = {rule: '', rating: 0};
      }
    );
  }

  ngOnDestroy(): void {
    this.spinnerSub.unsubscribe();
    this.loadedMovieSub.unsubscribe();
  }

  onFlagRule(movieTitle: string, rule: string, index: number) {
    if(!this.userInfo) {
      this.userInfo = this.buildCookie(this.rulesArray);
    }
    if(this.userInfo.rules[index].hasFlagged === true) {
      alert("You have already flagged this rule.")
      return;
    }
    this.userInfo.rules[index].hasFlagged = true;
    this.setCookie(this.movieFBKey, this.userInfo);
    Email.send({
      Host: 'smtp.elasticemail.com',
      Username: 'seanmeedev@gmail.com',
      Password: password,
      To: 'seanmeedev@gmail.com',
      From: 'seanmeedev@gmail.com',
      Subject: 'Flagged Rule',
      Body: `${movieTitle} has flagged rule: ${rule}`
    }).then(res => console.log(res));
  }

  onVote(vote: number, index: number){
    let rating: number;
    this.fbService.getFBMovie(this.movieFBKey).subscribe(res => {
      rating = res.rules[index].rating
      if(!this.userInfo){
        this.userInfo = this.buildCookie(this.rulesArray)
        this.userInfo.rules[index].hasVoted = true;
        this.userInfo.rules[index].vote = vote;
        this.rulesArray[index].rating = rating + vote;
      }else{
        if(this.userInfo.rules[index].hasVoted) {
          if(this.userInfo.rules[index].vote === vote) {
            this.rulesArray[index].rating = rating - vote;
            this.userInfo.rules[index].vote = null;
            this.userInfo.rules[index].hasVoted = false;
          }else{
            this.rulesArray[index].rating = rating + (vote*2);
            this.userInfo.rules[index].vote = vote;
          }
        }else{
          this.rulesArray[index].rating = rating + vote;
          this.userInfo.rules[index].hasVoted = true;
          this.userInfo.rules[index].vote = vote;
        }
      }
      this.setCookie(this.movieFBKey, this.userInfo)
      this.fbService.movieVoted(this.movieFBKey, {rules: this.rulesArray})
        .subscribe(res => {
        })
    })
  }

  onWatchMovie(){
    let viewCount = this.movie.viewCount;
    this.userInfo = this.getCookie(this.movieFBKey);
    if(!this.userInfo){
      this.userInfo = this.buildCookie(this.rulesArray)
    }
    if(this.userInfo.expiration && this.userInfo.expiration > Date.now()) {
      alert('You can only watch so many movies')
    }else {
      this.fbService
        .movieViewed(this.movieFBKey, {viewCount: ++viewCount})
        .subscribe(value => {
          this.movie.viewCount = value.viewCount
          this.userInfo.expiration = Date.now() + 120000
          this.setCookie(this.movieFBKey, this.userInfo)
        })
    }
  }

  buildCookie(rulesArray: Rule[]): Cookie {
    return {
      expiration: null,
      rules: rulesArray.map(() => {
        return {
          hasFlagged: false,
          hasVoted: false,
          vote: null
        }
      })
    };
  }

  getCookie(id: string): Cookie{
    return JSON.parse(localStorage.getItem(id));
  }

  setCookie(id: string, cookie: Cookie){
    localStorage.setItem(id, JSON.stringify(cookie));
  }
}
