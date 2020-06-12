import { Component, OnInit } from '@angular/core';
import {UiService} from '../../../shared/services/ui.service';
import {Router} from '@angular/router';
import {FirebaseService} from '../../../shared/services/firebase.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(
    private uiService: UiService,
    private router: Router,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  onCreateFBData() {
    this.uiService.sendMovieToFB().subscribe(
      response => {
        this.fbService.getMovie(response.name);
        this.uiService.hideModal();
        this.uiService.hideSpinner();
      }
    );
  }

  onCancelFBData() {
    this.router.navigate(['/movies']);
    this.uiService.hideModal();
  }
}
