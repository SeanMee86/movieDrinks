import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { UiService } from '../../../shared/services/ui.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/services/firebase.service';
import {Movie} from '../../../shared/models/movie.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input()
  newMovie: Movie;
  @Output()
  sendMovieInfo = new EventEmitter<Movie>();

  constructor(
    private uiService: UiService,
    private router: Router,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  onCreateFBData() {
    this.fbService.sendData(this.newMovie).subscribe(
      _ => {
        this.sendMovieInfo.emit(this.newMovie);
        this.uiService.hideSpinner();
      }
    );
    // this.uiService.sendMovieToFB().subscribe(
    //   response => {
    //     this.fbService.getMovie(response.name);
    //     this.uiService.hideModal();
    //     this.uiService.hideSpinner();
    //   }
    // );
  }

  onCancelFBData() {
    this.router.navigate(['/movies']);
    this.uiService.hideModal();
  }
}
