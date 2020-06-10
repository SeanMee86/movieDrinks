import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MovieSearchComponent} from './components/movie-search/movie-search.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {BrowseMoviesComponent} from './components/browse-movies/browse-movies.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'search', component: MovieSearchComponent },
  { path: 'browse', component: BrowseMoviesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
