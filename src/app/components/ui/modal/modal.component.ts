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
  sendKey = new EventEmitter<string>();

  constructor(
    private uiService: UiService,
    private router: Router,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  onCreateFBData() {
    this.fbService.sendData(this.newMovie).subscribe(
      fbKey => {
        this.sendKey.emit(fbKey.name);
        this.uiService.hideSpinner();
      }
    );
  }

  onCancelFBData() {
    this.router.navigate(['/movies']);
    this.uiService.hideModal();
  }
}
