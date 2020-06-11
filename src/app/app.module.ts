import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { MovieComponent } from './components/movie-search/movie/movie.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { MainSidebarComponent } from './layouts/sidebar/main-sidebar/main-sidebar.component';
import { BrowseSidebarComponent } from './layouts/sidebar/browse-sidebar/browse-sidebar.component';
import { MainContentComponent } from './layouts/main-content/main-content.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowseMoviesComponent } from './components/browse-movies/browse-movies.component';
import { LoadedMovieComponent } from './components/loaded-movie/loaded-movie.component';
import { ModalComponent } from './layouts/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieSearchComponent,
    MovieComponent,
    HeaderComponent,
    SidebarComponent,
    MainSidebarComponent,
    BrowseSidebarComponent,
    MainContentComponent,
    DashboardComponent,
    BrowseMoviesComponent,
    LoadedMovieComponent,
    ModalComponent
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
