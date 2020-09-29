import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Movie} from "../../../shared/models/movie.model";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss']
})
export class MainSidebarComponent implements OnInit{

  top5: Movie[];

  constructor(private fbService: FirebaseService) {
  }

  ngOnInit(): void {
    if(this.fbService.fbMovies.length) {
      console.log(this.fbService.fbMovies)
      this.buildTop5(this.fbService.fbMovies);
      console.log(this.top5)
    }else{
      this.fbService.getMovies().subscribe(_ => {
        this.fbService.fbMovies.map(movie => movie[Object.keys(movie)[0]]).sort((a,b) => a.viewCount < b.viewCount ? 1 : -1).forEach(movie => console.log(movie))
        this.buildTop5(this.fbService.fbMovies)
        console.log(this.top5)
      });
    }
  }

  buildTop5(movies: {[p: string]: Movie}[]){
    this.top5 = movies
      .map(movie => movie[Object.keys(movie)[0]])
      .sort((a, b) => a.viewCount - b.viewCount)
      .slice(0, 5);
  }
}
