import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowseMoviesComponent } from './components/browse-movies/browse-movies.component';
import { LoadedMovieComponent } from './components/loaded-movie/loaded-movie.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'movies', component: MovieSearchComponent  },
  { path: 'movies/:id', component: LoadedMovieComponent },
  { path: 'browse', component: BrowseMoviesComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
