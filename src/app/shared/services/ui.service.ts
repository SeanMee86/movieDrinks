import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Movie} from '../models/movie.model';
import {FirebaseService} from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  shouldShowModal = new Subject<boolean>();
  shouldShowSpinner = new Subject<boolean>();
  private movie: Movie;

  constructor(private fbService: FirebaseService) { }

  showModal(movie: Movie) {
    this.movie = movie;
    this.shouldShowModal.next(true);
  }

  hideModal() {
    this.shouldShowModal.next(false);
  }

  showSpinner() {
    this.shouldShowSpinner.next(true);
  }

  hideSpinner() {
    this.shouldShowSpinner.next(false);
  }

  sendMovieToFB() {
    return this.fbService.sendData(this.movie);
  }

}
