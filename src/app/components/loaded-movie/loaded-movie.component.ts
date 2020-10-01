import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Params, Router} from '@angular/router';

import {Subscription} from 'rxjs';
import {Movie} from '../../shared/models/movie.model';
import {MovieService} from '../../shared/services/movie.service';
import {UiService} from '../../shared/services/ui.service';
import {FirebaseService} from '../../shared/services/firebase.service';
import {faFlag, faThumbsDown, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {Email} from '../../../assets/smtp';
import {Rule} from '../../shared/models/rule.model'
import {password} from "../../config/elasticEmailPassword";

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
  newRule: Rule = {rule: '', rating: 0, isFlagged: false, hasVoted: false};
  rulesArray: Rule[] = [];
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
        if (localStorage.getItem(this.movieFBKey)) {
          this.rulesArray = JSON.parse(localStorage.getItem(this.movieFBKey))
        }
        else if (this.movie.rules) {
          this.rulesArray = [...this.movie.rules];
        }
        if(this.rulesArray.length) {
          const viewCount = this.movie.viewCount + 1
          this.fbService
            .movieViewed(this.movieFBKey, {viewCount})
            .subscribe(value => {
              this.movie.viewCount = value.viewCount
            })
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
    this.fbService.updateMovie(this.movieFBKey, {rules: updatedRules}).subscribe(
      data => {
        this.movie.rules = data.rules;
        this.rulesArray.push(this.newRule);
        if(localStorage.getItem(this.movieFBKey)) {
          localStorage.setItem(this.movieFBKey, JSON.stringify(this.rulesArray))
        }
        this.newRule = {rule: '', rating: 0, isFlagged: false, hasVoted: false};
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

  onFlagRule(movieTitle: string, rule: string, id: string, index: number) {
    if(!this.rulesArray[index].isFlagged){
      this.rulesArray[index].isFlagged = true;
      localStorage.setItem(id, JSON.stringify(this.rulesArray))
      Email.send({
        Host: 'smtp.elasticemail.com',
        Username: 'seanmeedev@gmail.com',
        Password: password,
        To: 'seanmeedev@gmail.com',
        From: 'seanmeedev@gmail.com',
        Subject: 'Flagged Rule',
        Body: `${movieTitle} has flagged rule: ${rule}`
      }).then(res => console.log(res));
    }else{
      alert("You have already flagged this rule.")
    }
  }

  onVote(vote: number, rule: Rule, index: number){
    if(this.rulesArray[index].hasVoted){
      if(this.rulesArray[index].vote === vote) {
        this.rulesArray[index].rating = rule.rating - vote
        this.rulesArray[index].vote = null;
        this.rulesArray[index].hasVoted = false;
        localStorage.setItem(this.movieFBKey, JSON.stringify(this.rulesArray));
      } else {
        this.rulesArray[index].rating = rule.rating + (vote * 2);
        this.rulesArray[index].vote = vote;
        localStorage.setItem(this.movieFBKey, JSON.stringify(this.rulesArray));
      }
    } else {
      this.rulesArray[index].rating = rule.rating + vote;
      this.rulesArray[index].hasVoted = true;
      this.rulesArray[index].vote = vote;
      localStorage.setItem(this.movieFBKey, JSON.stringify(this.rulesArray));
    }
    this.fbService.movieVoted(this.movieFBKey, {rules: this.rulesArray})
      .subscribe(res => {
        console.log(this.rulesArray);
      })
  }
}
