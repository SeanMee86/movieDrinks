import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MovieSearchComponent} from './components/movie-search/movie-search.component';

const routes: Routes = [
  { path: 'search', component: MovieSearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
