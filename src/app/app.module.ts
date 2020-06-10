import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MoviesComponent } from './components/movie-search/movies/movies.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { MovieComponent } from './components/movie-search/movies/movie/movie.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    MovieSearchComponent,
    MovieComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
