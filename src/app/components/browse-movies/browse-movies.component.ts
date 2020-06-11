import {Component, OnDestroy, OnInit} from '@angular/core';
import {SidebarService} from '../../shared/services/sidebar.service';
import {FirebaseService} from '../../shared/services/firebase.service';

@Component({
  selector: 'app-browse-movies',
  templateUrl: './browse-movies.component.html',
  styleUrls: ['./browse-movies.component.scss']
})
export class BrowseMoviesComponent implements OnInit, OnDestroy {

  constructor(
    private sidebarService: SidebarService,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.sidebarService.showBrowse();
  }

  ngOnDestroy(): void {
    this.sidebarService.showMain();
  }

  getMoviesFB() {
    this.fbService.getMovies().subscribe(
      response => {
        console.log(response);
      }
    );
  }
}
