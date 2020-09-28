import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { MovieComponent } from './components/movie/movie.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { MainSidebarComponent } from './layouts/sidebar/main-sidebar/main-sidebar.component';
import { BrowseSidebarComponent } from './layouts/sidebar/browse-sidebar/browse-sidebar.component';
import { MainContentComponent } from './layouts/main-content/main-content.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowseMoviesComponent } from './components/browse-movies/browse-movies.component';
import { LoadedMovieComponent } from './components/loaded-movie/loaded-movie.component';
import { ModalComponent } from './components/ui/modal/modal.component';
import { SpinnerComponent } from './components/ui/spinner/spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

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
    ModalComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
