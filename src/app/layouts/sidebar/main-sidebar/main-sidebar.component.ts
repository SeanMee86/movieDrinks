import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Movie} from "../../../shared/models/movie.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss']
})
export class MainSidebarComponent implements OnInit{

  top5: Movie[];

  constructor(private fbService: FirebaseService, private router: Router) {
  }

  ngOnInit(): void {
    if(this.fbService.fbMovies.length) {
      this.buildTop5(this.fbService.fbMovies);
    }else{
      this.fbService.getMovies().subscribe(_ => {
        this.buildTop5(this.fbService.fbMovies)
      });
    }
  }

  buildTop5(movies: {[p: string]: Movie}[]){
    this.top5 = movies
      .map(movie => movie[Object.keys(movie)[0]])
      .filter(movie => movie.rules)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5);
  }

  loadMovie(id: string){
    this.router.navigate(['movies', id])
    this.fbService
      .loadMovie
      .next(this.fbService
        .fbMovies
        .find(movie => movie[Object.keys(movie)[0]].id === id))
  }
}
