import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { UiService } from '../../shared/services/ui.service';
import { Subscription } from 'rxjs';
import { Movie } from '../../shared/models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse-movies',
  templateUrl: './browse-movies.component.html',
  styleUrls: ['./browse-movies.component.scss']
})
export class BrowseMoviesComponent implements OnInit, OnDestroy {
  showSpinner = true;
  spinnerSub: Subscription;
  movies: Movie[] = [];

  constructor(
    private sidebarService: SidebarService,
    private fbService: FirebaseService,
    private uiService: UiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sidebarService.showBrowse();
    this.spinnerSub = this.uiService.shouldShowSpinner.subscribe(
      value => this.showSpinner = value
    );

    if (this.fbService.fbMovies.length) {
      this.movies = this.fbService.fbMovies
        .slice()
        .map<Movie>(fbMovie => fbMovie[Object.keys(fbMovie)[0]])
        .sort((a, b) => a.title > b.title ? 1 : -1);
      this.uiService.hideSpinner();
    } else {
      this.fbService.getMovies().subscribe(
        response => {
          this.movies = response
            .map<Movie>(fbMovie => fbMovie[Object.keys(fbMovie)[0]])
            .sort((a, b) => a.title > b.title ? 1 : -1);
          this.uiService.hideSpinner();
        }
      );
    }
  }

  loadMovie(id: string) {
    this.router.navigate(['/movies', id]);
  }

  ngOnDestroy(): void {
    this.sidebarService.showMain();
    this.spinnerSub.unsubscribe();
  }
}
