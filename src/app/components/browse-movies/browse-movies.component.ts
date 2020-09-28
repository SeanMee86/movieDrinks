import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { SidebarService } from '../../shared/services/sidebar.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Movie } from '../../shared/models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse-movies',
  templateUrl: './browse-movies.component.html',
  styleUrls: ['./browse-movies.component.scss']
})
export class BrowseMoviesComponent implements OnInit, OnDestroy {
  showSpinner = true;
  movies: Movie[] = [];

  constructor(
    private sidebarService: SidebarService,
    private fbService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sidebarService.showBrowse();
    if (this.fbService.fbMovies.length) {
      this.movies = this.findAndSort(this.fbService.fbMovies);
      this.showSpinner = false;
    } else {
      this.fbService.getMovies().subscribe(
        response => {
          this.movies = this.findAndSort(response);
          this.showSpinner = false;
        }
      );
    }
    this.fbService.filteredMovies.subscribe(filteredMovies => {
      this.movies = filteredMovies.map(movie => movie[Object.keys(movie)[0]])
    })
  }

  findAndSort(movieData: {[s: string]: Movie}[]) {
    return movieData
      .map(fbMovie => fbMovie[Object.keys(fbMovie)[0]])
      .sort((a, b) => a.title > b.title ? 1 : -1);
  }

  loadMovie(id: string) {
    this.router.navigate(['/movies', id]);
  }

  ngOnDestroy(): void {
    this.sidebarService.showMain();
  }
}
