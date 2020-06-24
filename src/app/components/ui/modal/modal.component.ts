import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UiService } from '../../../shared/services/ui.service';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { Movie } from '../../../shared/models/movie.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit {
  @Input()
  newMovie: Movie;

  @Output()
  sendKey = new EventEmitter<string>();

  @ViewChild('content')
  content: NgbActiveModal;

  categoryValue = 'action';
  categories: string[] = [
    'Action',
    'Adventure',
    'Comedy',
    'Crime',
    'Drama',
    'Historical',
    'Horror',
    'Musical',
    'Sci-Fi',
    'War',
    'Western'
  ];

  constructor(
    private uiService: UiService,
    private router: Router,
    private fbService: FirebaseService,
    private modalService: NgbModal
  ) { }

  ngAfterViewInit() {
    this.modalService.open(this.content).result.then(
      _ => {}, reason => {
        if (reason === 'MOVIE_CONFIRMED') {
          this.uiService.hideSpinner();
        } else {
          this.router.navigate(['/movies']);
        }
      }
    );
  }

  onCreateFBData() {
    console.log(this.newMovie);
    this.fbService.sendData({...this.newMovie, category: this.categoryValue}).subscribe(
      fbKey => {
        this.sendKey.emit(fbKey.name);
        this.uiService.hideSpinner();
      }
    );
  }
}
