import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { UiService } from '../../../shared/services/ui.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { Movie } from '../../../shared/models/movie.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    this.fbService.sendData(this.newMovie).subscribe(
      fbKey => {
        this.sendKey.emit(fbKey.name);
        this.uiService.hideSpinner();
      }
    );
  }
}
