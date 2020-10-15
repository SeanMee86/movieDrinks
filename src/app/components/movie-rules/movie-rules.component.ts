import {
  Component,
  Input
} from '@angular/core';
import { Rule } from "../../shared/models/rule.model";
import {MovieCookie} from "../../shared/models/movie-cookie.model";
import {
  faFlag,
  faThumbsDown,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";
import { Movie } from "../../shared/models/movie.model";
import { password } from "../../config/elasticEmailPassword";
import { Email } from '../../../assets/smtp';
import { FirebaseService } from "../../shared/services/firebase.service";
import { CookieService } from "../../shared/services/cookie.service";

@Component({
  selector: 'app-movie-rules',
  templateUrl: './movie-rules.component.html',
  styleUrls: ['./movie-rules.component.scss']
})
export class MovieRulesComponent {

  @Input()
  rulesArray: Rule[];
  @Input()
  movie: Movie;
  @Input()
  movieFBKey: string;
  @Input()
  userInfo: MovieCookie;

  faFlag = faFlag;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;

  constructor(
    private fbService: FirebaseService,
    private cs: CookieService
  ) { }

  onFlagRule(movieTitle: string, rule: string, index: number) {
    if(!this.userInfo) {
      this.userInfo = this.cs.buildMovieCookie(this.rulesArray);
    }
    if(this.userInfo.rules[index].hasFlagged === true) {
      alert("You have already flagged this rule.")
      return;
    }
    this.userInfo.rules[index].hasFlagged = true;
    this.cs.setMovieCookie(this.movieFBKey, this.userInfo);
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
        this.userInfo = this.cs.buildMovieCookie(this.rulesArray)
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
      this.cs.setMovieCookie(this.movieFBKey, this.userInfo)
      this.fbService.movieVoted(this.movieFBKey, {rules: this.rulesArray})
        .subscribe(res => {
        })
    })
  }
}
